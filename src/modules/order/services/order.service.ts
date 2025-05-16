import { Service } from 'typedi'
import { Errors } from '../../../utils/error'
import { removeUndefinedFields } from '../../../utils'
import { plainToInstance } from 'class-transformer'
import { DBTypeMapping } from '../../../configs/types/application-constants.type'
import { AppDataSources, startTransaction } from '../../../database/connection'
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

@Service()
export class OrderService {
    checkStatus(entity: Order) {
        if (!entity) {
            throw Errors.OrderNotFound
        }
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

        const [branchs, total] = await Promise.all([
            query
                .limit(req.pagination.limit)
                .offset(req.pagination.getOffset())
                .orderBy('o.createdAt', 'ASC')
                .getRawMany(),
            countQuery.getCount(),
        ])

        req.pagination.total = total

        return branchs
    }

    async createOrder(req: CreateOrderRequest) {
        return await startTransaction(
            DBTypeMapping[req.getDataSource()],
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
        return await startTransaction(
            AppDataSources.master,
            async (manager) => {
                const order = await manager.findOne(Order, {
                    where: { orderId },
                })

                this.checkStatus(order)

                await this.checkUserAction(userAction, order, manager)

                await manager.softDelete(Order, { orderId })
            }
        )
    }

    async cancelOrder(orderId: string, userAction: UserDTO) {
        return await startTransaction(
            AppDataSources.master,
            async (manager) => {
                const order = await manager.findOne(Order, {
                    where: { orderId },
                })

                this.checkStatus(order)

                if (
                    order.status == OrderStatus.Completed ||
                    order.status == OrderStatus.Canceled
                ) {
                    throw Errors.InvalidData
                }
                //TODO: check if order is in progress

                await this.checkUserAction(userAction, order, manager)

                order.status = OrderStatus.Canceled
                order.updatedBy = userAction.userId

                await manager.save(Order, order)
            }
        )
    }

    async completeOrder(orderId: string, userAction: UserDTO) {
        return await startTransaction(
            AppDataSources.master,
            async (manager) => {
                const order = await manager.findOne(Order, {
                    where: { orderId },
                })

                this.checkStatus(order)

                if (
                    order.status == OrderStatus.Completed ||
                    order.status == OrderStatus.Canceled
                ) {
                    throw Errors.InvalidData
                }
                //TODO: check if order is in progress

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
