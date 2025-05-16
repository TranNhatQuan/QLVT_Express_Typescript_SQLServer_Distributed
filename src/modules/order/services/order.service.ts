import { Service } from 'typedi'
import { Errors } from '../../../utils/error'
import { removeUndefinedFields } from '../../../utils'
import { plainToInstance } from 'class-transformer'
import {
    DBType,
    DBTypeMapping,
} from '../../../configs/types/application-constants.type'
import {
    createQueryManager,
    startTransaction,
} from '../../../database/connection'
import { Order } from '../entities/order.entity'
import {
    GetListOrderRequest,
    OrderFilter,
} from '../requests/get-list-order.request'
import { CreateOrderRequest } from '../requests/create-order.request'
import { OrderDetail } from '../entities/order-detail.entity'
import { UserDTO } from '../../user/dtos/user.dto'
import { UserRole } from '../../user/types/role.type'
import { User } from '../../user/entities/user.entity'
import { OrderStatus } from '../types/order-status.type'
import { EntityManager } from 'typeorm'
import { OrderType } from '../types/order.type'
import { Warehouse } from '../../warehouse/entities/warehouse.entity'
import { Product } from '../../product/entities/product.entity'

@Service()
export class OrderService {
    checkStatus(entity: Order) {
        if (!entity) {
            throw Errors.OrderNotFound
        }
    }

    async getOrderDetail(
        orderId: string,
        userAction: UserDTO,
        manager: EntityManager
    ) {
        return await manager
            .getRepository(Order)
            .createQueryBuilder()
            .from(Order, 'o')
            .where({
                oderId,
            })
            .leftJoin(OrderDetail, 'od', 'o.orderId = od.orderId')
            .leftJoin(Product, 'p', 'od.productId = p.productId')
            .select([
                'o.*',
                `JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'productId', od.productId,
                                    'quantity', od.quantity,
                                    'price', od.price,
                                    'productName', p.name,
                                    'productUnit', p.unit
                                )
                ) details`,
            ])
            .groupBy('o.orderId')
            .limit(req.pagination.limit)
            .offset(req.pagination.getOffset())
            .orderBy('o.createdAt', 'ASC')
            .getRawOne()
    }

    async getOrders(req: GetListOrderRequest) {
        const filter = removeUndefinedFields(
            plainToInstance(OrderFilter, req, {
                excludeExtraneousValues: true,
            })
        )

        const query = DBTypeMapping[req.dbType]
            .getRepository(Order)
            .createQueryBuilder()
            .from(Order, 'o')
            .where(removeUndefinedFields(filter))

        const countQuery = query.clone()

        query
            .leftJoin(OrderDetail, 'od', 'o.orderId = od.orderId')
            .leftJoin(Product, 'p', 'od.productId = p.productId')
            .select([
                'o.*',
                `JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'productId', od.productId,
                                    'quantity', od.quantity,
                                    'price', od.price,
                                    'productName', p.name,
                                    'productUnit', p.unit
                                )
                ) details`,
            ])
            .groupBy('o.orderId')
            .limit(req.pagination.limit)
            .offset(req.pagination.getOffset())
            .orderBy('o.createdAt', 'ASC')

        const [branchs, total] = await Promise.all([
            query.getRawMany(),
            countQuery.getCount(),
        ])

        req.pagination.total = total

        return branchs
    }

    async createOrder(req: CreateOrderRequest) {
        return await startTransaction(
            DBTypeMapping[req.dbType],
            async (manager) => {
                await req.validateRequest(manager)

                const orderEntity = plainToInstance(Order, req, {
                    excludeExtraneousValues: true,
                })

                orderEntity.setCreatedAndUpdatedBy(req.userAction.userId)

                await manager.insert(Order, orderEntity)

                req.details.forEach((detail) => {
                    detail.orderId = orderEntity.orderId
                })

                const details = []

                for (const detail of req.details) {
                    const detailEntity = plainToInstance(OrderDetail, detail, {
                        excludeExtraneousValues: true,
                    })

                    detailEntity.setCreatedAndUpdatedBy(req.userAction.userId)

                    await manager.insert(OrderDetail, detailEntity)

                    details.push(detailEntity)
                }

                orderEntity['details'] = details

                return orderEntity
            }
        )
    }

    async deleteOrder(orderId: string, userAction: UserDTO) {
        userAction.loadOrginDBType()

        return await startTransaction(
            DBTypeMapping[userAction.originDBType],
            async (manager) => {
                const order = await manager.findOne(Order, {
                    where: { orderId },
                })

                this.checkStatus(order)

                if (order.status !== OrderStatus.Init) throw Errors.InvalidData

                await this.checkUserAction(userAction, order, manager)

                await manager.softDelete(Order, { orderId })
            }
        )
    }

    async cancelOrder(orderId: string, userAction: UserDTO) {
        userAction.loadOrginDBType()

        return await startTransaction(
            DBTypeMapping[userAction.originDBType],
            async (manager) => {
                const order = await manager.findOne(Order, {
                    where: { orderId },
                })

                this.checkStatus(order)

                if (
                    order.status == OrderStatus.Completed ||
                    order.status == OrderStatus.Canceled ||
                    order.type == OrderType.Transfer
                ) {
                    throw Errors.InvalidData
                }
                //TODO: check if order is in progress

                const warehouseId =
                    order.sourceWarehouseId ?? order.destinationWarehouseId

                //TODO: check order done

                await this.checkUserAction(userAction, order, manager)

                order.status = OrderStatus.Canceled
                order.updatedBy = userAction.userId

                await manager.save(Order, order)
            }
        )
    }

    async completeOrder(orderId: string, userAction: UserDTO) {
        userAction.loadOrginDBType()

        return await startTransaction(
            DBTypeMapping[userAction.originDBType],
            async (manager) => {
                const order = await manager.findOne(Order, {
                    where: { orderId },
                })

                this.checkStatus(order)

                if (
                    order.status == OrderStatus.Completed ||
                    order.status == OrderStatus.Canceled ||
                    order.type == OrderType.Transfer
                ) {
                    throw Errors.InvalidData
                }
                //TODO: check if order is in progress

                await this.checkUserAction(userAction, order, manager)

                const warehouseId =
                    order.sourceWarehouseId ?? order.destinationWarehouseId

                //TODO: check order done

                order.status = OrderStatus.Completed
                order.updatedBy = userAction.userId

                await manager.save(Order, order)
            }
        )
    }

    async completeOrderTransfer(orderId: string, userAction: UserDTO) {
        userAction.loadOrginDBType()

        let order: Order

        await createQueryManager(
            DBTypeMapping[userAction.originDBType],
            async (manager) => {
                order = await manager.findOne(Order, {
                    where: { orderId },
                })

                this.checkStatus(order)

                if (
                    order.status == OrderStatus.Completed ||
                    order.status == OrderStatus.Canceled ||
                    order.type == OrderType.Transfer
                ) {
                    throw Errors.InvalidData
                }

                const warehouseId = order.destinationWarehouseId

                // check progress warehouse

                await this.checkUserAction(userAction, order, manager)
            }
        )

        let sourceWarehouse: Warehouse

        await createQueryManager(DBTypeMapping.USER, async (manager) => {
            const warehouseId = order.sourceWarehouseId

            sourceWarehouse = await manager.findOne(Warehouse, {
                where: { warehouseId },
            })

            if (!sourceWarehouse) {
                throw Errors.WarehouseNotFound
            }

            await this.checkUserAction(userAction, order, manager)
        })

        await createQueryManager(
            DBTypeMapping[DBType[sourceWarehouse.branchId]],
            async (manager) => {
                //check progress warehouse
            }
        )

        return await startTransaction(
            DBTypeMapping[userAction.originDBType],
            async (manager) => {
                const order = await manager.findOne(Order, {
                    where: { orderId },
                })

                this.checkStatus(order)

                if (
                    order.status == OrderStatus.Completed ||
                    order.status == OrderStatus.Canceled ||
                    order.type == OrderType.Transfer
                ) {
                    throw Errors.InvalidData
                }
                //TODO: check if order is in progress

                await this.checkUserAction(userAction, order, manager)

                const warehouseId =
                    order.sourceWarehouseId ?? order.destinationWarehouseId

                //TODO: check order done

                order.status = OrderStatus.Completed
                order.updatedBy = userAction.userId

                await manager.save(Order, order)
            }
        )
    }

    async checkUserAction(
        userAction: UserDTO,
        order: Order,
        manager: EntityManager
    ) {
        const user = await manager.findOne(User, {
            where: { userId: order.userId },
        })

        if (
            (order.createdBy !== userAction.userId &&
                userAction.role === UserRole.Staff) ||
            (userAction.role === UserRole.BranchManager &&
                userAction.branchId !== user.branchId) ||
            userAction.role !== UserRole.CompanyAdmin
        )
            throw Errors.Forbidden
    }
}
