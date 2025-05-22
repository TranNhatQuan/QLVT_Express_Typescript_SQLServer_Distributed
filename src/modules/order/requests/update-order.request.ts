import { Expose, plainToInstance } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'
import { UserDTO } from '../../user/dtos/user.dto'
import { OrderType } from '../types/order.type'
import { EntityManager } from 'typeorm'
import { Errors } from '../../../utils/error'
import { Warehouse } from '../../warehouse/entities/warehouse.entity'
import { Customer } from '../../customer/entities/customer.entity'
import { Order } from '../entities/order.entity'

export class UpdateOrderDTO {
    @Expose()
    type: OrderType

    @Expose()
    @IsNumber()
    sourceWarehouseId: number

    @Expose()
    @IsNumber()
    destinationWarehouseId: number

    @Expose()
    @IsNumber()
    customerId: number

    @Expose()
    updatedBy: string

    @Expose()
    updatedTime: Date
}

export class UpdateOrderRequest {
    @Expose()
    @IsNotEmpty()
    orderId: string

    @Expose()
    @IsOptional()
    @IsEnum(OrderType)
    type?: OrderType

    @Expose()
    @IsNumber()
    @IsOptional()
    sourceWarehouseId?: number

    @Expose()
    @IsNumber()
    @IsOptional()
    destinationWarehouseId?: number

    @Expose()
    @IsNumber()
    @IsOptional()
    customerId?: number

    @Expose()
    userAction?: UserDTO

    sourceWarehouse: Warehouse
    destinationWarehouse: Warehouse
    customer: Customer
    order: Order
    branchId: string

    async validateRequest(manager: EntityManager) {
        this.order = await manager.getRepository(Order).findOne({
            where: {
                orderId: this.orderId,
            },
        })

        if (!this.order) {
            throw Errors.OrderNotFound
        }
        this.type ??= this.order.type
        this.sourceWarehouseId ??= this.order.sourceWarehouseId
        this.destinationWarehouseId ??= this.order.destinationWarehouseId
        this.customerId ??= this.order.customerId

        if (this.type === OrderType.Transfer) {
            if (!this.destinationWarehouseId || !this.sourceWarehouseId)
                throw Errors.InvalidData
        } else {
            if (!this.customerId) throw Errors.InvalidData

            if (!this.sourceWarehouseId && !this.destinationWarehouseId)
                throw Errors.InvalidData
        }

        if (this.type === OrderType.Import) {
            this.destinationWarehouseId = null

            if (!this.sourceWarehouseId) throw Errors.InvalidData
        }
        if (this.type === OrderType.Export) {
            this.sourceWarehouseId = null

            if (!this.destinationWarehouseId) throw Errors.InvalidData
        }

        if (this.sourceWarehouseId) {
            this.sourceWarehouse = await manager
                .getRepository(Warehouse)
                .findOne({
                    where: {
                        warehouseId: this.sourceWarehouseId,
                    },
                })

            if (!this.sourceWarehouse) {
                throw Errors.WarehouseNotFound
            }
            this.branchId = this.sourceWarehouse.branchId
        }

        if (this.destinationWarehouseId) {
            this.destinationWarehouse = await manager
                .getRepository(Warehouse)
                .findOne({
                    where: {
                        warehouseId: this.destinationWarehouseId,
                    },
                })

            if (!this.destinationWarehouse) {
                throw Errors.WarehouseNotFound
            }

            this.branchId = this.destinationWarehouse.branchId
        }

        if (this.customerId) {
            this.customer = await manager.getRepository(Customer).findOne({
                where: {
                    customerId: this.customerId,
                },
            })

            if (!this.customer) {
                throw Errors.CustomerNotFound
            }
        }

        if (this.branchId !== this.userAction.branchId) {
            throw Errors.NotSupportedFeature
        }

        if (
            this.type === OrderType.Transfer &&
            this.sourceWarehouse.branchId !== this.destinationWarehouse.branchId
        ) {
            throw Errors.NotSupportedFeature
        }
    }

    getDataForUpdate() {
        const data = plainToInstance(UpdateOrderDTO, this, {
            excludeExtraneousValues: true,
        })

        data.updatedBy = this.userAction.userId

        data.updatedTime = new Date()

        return data
    }
}
