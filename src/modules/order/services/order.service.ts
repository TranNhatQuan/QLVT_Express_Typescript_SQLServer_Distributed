import { Service } from 'typedi'
import { Errors } from '../../../utils/error'
import { removeUndefinedFields } from '../../../utils'
import { plainToInstance } from 'class-transformer'
import { DBTypeMapping } from '../../../configs/types/application-constants.type'
import { startTransaction } from '../../../database/connection'
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
import { ExportReceipt } from '../../export/entities/export-receipt.entity'
import { ImportReceipt } from '../../import/entities/import-receipt.entity'
import { OrderDTO } from '../dtos/order.dto'
import { UpdateOrderRequest } from '../requests/update-order.request'

@Service()
export class OrderService {
    checkStatus(entity: Order) {
        if (!entity) {
            throw Errors.OrderNotFound
        }
    }

    async getOrderDetail(orderId: string, manager: EntityManager) {
        const [orderEntity, importDetails, exportDetails] = await Promise.all([
            manager
                .getRepository(Order)
                .createQueryBuilder('o')
                .where('o.orderId = :orderId', { orderId })
                .select([
                    'o.orderId orderId',
                    'o.type type',
                    'o.status status',
                    'o.createdTime createdTime',
                    'o.updatedTime updatedTime',
                    'o.createdBy createdBy',
                    'o.updatedBy updatedBy',
                    'o.customerId customerId',
                    'o.sourceWarehouseId sourceWarehouseId',
                    'o.destinationWarehouseId destinationWarehouseId',
                ])
                .addSelect(
                    `COALESCE(JSON_QUERY((
                SELECT 
                    od.productId productId,
                    od.quantity quantity,
                    od.price price,
                    p.name productName,
                    p.unit productUnit
                FROM OrderDetail od
                LEFT JOIN Product p ON p.productId = od.productId
                WHERE od.orderId = o.orderId
                FOR JSON PATH
            )),'[]')`,
                    'jsonDetails'
                )
                .getRawOne(),
            manager
                .getRepository(ImportReceipt)
                .createQueryBuilder('ir')
                .where('ir.orderId = :orderId', { orderId })
                .select(['ir.importId importId'])
                .addSelect(
                    `COALESCE(JSON_QUERY((
                SELECT 
                    ird.productId productId,
                    ird.quantity quantity,
                    p.name productName,
                    p.unit productUnit
                FROM ImportReceiptDetail ird
                LEFT JOIN Product p ON p.productId = ird.productId
                WHERE ird.importId = ir.importId
                FOR JSON PATH
            )),'[]')`,
                    'jsonDetails'
                )
                .getRawMany(),
            manager
                .getRepository(ExportReceipt)
                .createQueryBuilder('ir')

                .where('ir.orderId = :orderId', { orderId })
                .select(['ir.exportId exportId'])
                .addSelect(
                    `COALESCE(JSON_QUERY((
                SELECT 
                    ird.productId productId,
                    ird.quantity quantity,
                    p.name productName,
                    p.unit productUnit
                FROM ExportReceiptDetail ird
                LEFT JOIN Product p ON p.productId = ird.productId
                WHERE ird.exportId = ir.exportId
                FOR JSON PATH
            )),'[]')`,
                    'jsonDetails'
                )

                .getRawMany(),
        ])

        orderEntity.importDetails = importDetails
        orderEntity.exportDetails = exportDetails

        const order = plainToInstance(OrderDTO, orderEntity, {
            excludeExtraneousValues: true,
        })

        const importQtyMap = new Map<number, number>()

        order.importDetails.forEach((importItem) => {
            const details = importItem.details ?? []

            details.forEach((d) => {
                const current = importQtyMap.get(d.productId) || 0
                importQtyMap.set(d.productId, current + (d.quantity || 0))
            })
        })

        const exportQtyMap = new Map<number, number>()

        order.exportDetails.forEach((exportItem) => {
            const details = exportItem.details ?? []

            details.forEach((d) => {
                const current = exportQtyMap.get(d.productId) || 0
                exportQtyMap.set(d.productId, current + (d.quantity || 0))
            })
        })

        order.details.forEach((detail) => {
            detail.importedQuantity = importQtyMap.get(detail.productId) || 0
            detail.exportedQuantity = exportQtyMap.get(detail.productId) || 0

            detail.importDone = detail.importedQuantity >= detail.quantity
            detail.exportDone = detail.exportedQuantity >= detail.quantity
        })

        order.importDone = order.details.every((d) => d.importDone)
        order.exportDone = order.details.every((d) => d.exportDone)

        return order
    }

    async getOrders(req: GetListOrderRequest) {
        const filter = removeUndefinedFields(
            plainToInstance(OrderFilter, req, {
                excludeExtraneousValues: true,
            })
        )

        const query = DBTypeMapping[req.dbType]
            .getRepository(Order)
            .createQueryBuilder('o')
            .where(removeUndefinedFields(filter))

        const countQuery = query.clone()

        query
            .select([
                'o.orderId orderId',
                'o.type type',
                'o.status status',
                'o.createdTime createdTime',
                'o.updatedTime updatedTime',
                'o.createdBy createdBy',
                'o.updatedBy updatedBy',
                'o.customerId customerId',
                'o.sourceWarehouseId sourceWarehouseId',
                'o.destinationWarehouseId destinationWarehouseId',
            ])
            .addSelect(
                `COALESCE(JSON_QUERY((
                SELECT 
                    od.productId,
                    od.quantity,
                    od.price,
                    p.name AS productName,
                    p.unit AS productUnit
                FROM OrderDetail od
                LEFT JOIN Product p ON p.productId = od.productId
                WHERE od.orderId = o.orderId
                FOR JSON PATH
            )),'[]')`,
                'jsonDetails'
            )
            .limit(req.pagination.limit)
            .offset(req.pagination.getOffset())
            .orderBy('o.createdTime', 'ASC')

        const [data, total] = await Promise.all([
            query.getRawMany(),
            countQuery.getCount(),
        ])

        req.pagination.total = total

        return plainToInstance(OrderDTO, data, {
            excludeExtraneousValues: true,
        })
    }

    async createOrder(req: CreateOrderRequest) {
        return await startTransaction(
            DBTypeMapping[req.userAction.originDBType],
            async (manager) => {
                await req.validateRequest(manager)

                const orderEntity = plainToInstance(Order, req, {
                    excludeExtraneousValues: true,
                })

                orderEntity.setCreatedAndUpdatedBy(req.userAction.userId)

                await orderEntity.genId(manager, req.branchId)

                await manager.insert(Order, orderEntity)

                const details = []

                for (const detail of req.details) {
                    const detailEntity = plainToInstance(OrderDetail, detail, {
                        excludeExtraneousValues: true,
                    })

                    detailEntity.setCreatedAndUpdatedBy(req.userAction.userId)

                    detailEntity.orderId = orderEntity.orderId

                    await manager.insert(OrderDetail, detailEntity)

                    details.push(detailEntity)
                }

                orderEntity['details'] = details

                return orderEntity
            }
        )
    }

    async updateOrder(req: UpdateOrderRequest) {
        return await startTransaction(
            DBTypeMapping[req.userAction.originDBType],
            async (manager) => {
                await req.validateRequest(manager)

                await this.checkUserAction(req.userAction, req.order, manager)

                await manager.update(Order, req.orderId, req.getDataForUpdate())

                return true
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

    async completeOrder(orderId: string, userAction: UserDTO) {
        return await startTransaction(
            DBTypeMapping[userAction.originDBType],
            async (manager) => {
                const order = await this.getOrderDetail(orderId, manager)

                if (!order) throw Errors.OrderNotFound

                if (
                    order.status == OrderStatus.Completed ||
                    order.status == OrderStatus.Canceled
                ) {
                    throw Errors.InvalidData
                }

                if (order.type == OrderType.Export && !order.exportDone) {
                    throw Errors.OrderExportNotCompleted
                }

                if (order.type == OrderType.Import && !order.importDone) {
                    throw Errors.OrderImportNotCompleted
                }

                if (
                    order.type == OrderType.Transfer &&
                    !(order.importDone && order.exportDone)
                ) {
                    throw Errors.OrderTransferNotCompleted
                }

                await this.checkUserAction(userAction, order, manager)

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
            where: { userId: order.createdBy },
        })

        if (
            user.role === UserRole.Staff &&
            order.createdBy == userAction.userId
        )
            return

        if (
            userAction.role === UserRole.BranchManager &&
            userAction.branchId === user.branchId
        )
            return

        throw Errors.Forbidden
    }
}
