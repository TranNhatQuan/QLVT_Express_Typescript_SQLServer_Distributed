import { Expose, Type } from 'class-transformer'
import {
    IsArray,
    IsEnum,
    IsNumber,
    IsOptional,
    ValidateNested,
} from 'class-validator'
import { UserDTO } from '../../user/dtos/user.dto'
import { OrderType } from '../types/order.type'
import { EntityManager } from 'typeorm'
import { Errors } from '../../../utils/error'
import { Warehouse } from '../../warehouse/entities/warehouse.entity'
import { Customer } from '../../customer/entities/customer.entity'
import { Product } from '../../product/entities/product.entity'

export class OrderDetailDTO {
    @Expose()
    orderId: string

    @Expose()
    @IsNumber()
    productId: number

    @Expose()
    @IsNumber()
    quantity: number

    @Expose()
    @IsNumber()
    price: number
}

export class CreateOrderRequest {
    @Expose()
    @IsEnum(OrderType)
    type: OrderType

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
    @Type(() => OrderDetailDTO)
    @IsArray()
    @ValidateNested({ each: true })
    details: OrderDetailDTO[]

    @Expose()
    userAction?: UserDTO

    sourceWarehouse: Warehouse
    destinationWarehouse: Warehouse
    customer: Customer
    branchId: string

    async validateOrderDetail(detail: OrderDetailDTO, manager: EntityManager) {
        const product = await manager.getRepository(Product).findOne({
            where: {
                productId: detail.productId,
            },
        })

        if (!product) {
            throw Errors.ProductNotFound
        }
    }

    async validateRequest(manager: EntityManager) {
        if (this.type === OrderType.Transfer) {
            if (!this.destinationWarehouseId || !this.sourceWarehouseId)
                throw Errors.InvalidData
        } else {
            if (!this.customerId) throw Errors.InvalidData

            if (!this.sourceWarehouseId && !this.destinationWarehouseId)
                throw Errors.InvalidData
        }

        if (this.type === OrderType.Import) {
            delete this.destinationWarehouseId

            if (!this.sourceWarehouseId) throw Errors.InvalidData
        }
        if (this.type === OrderType.Export) {
            delete this.sourceWarehouseId

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

        if (
            this.type === OrderType.Transfer &&
            this.sourceWarehouse.branchId !== this.destinationWarehouse.branchId
        ) {
            throw Errors.NotSupportedFeature
        }

        for (const detail of this.details) {
            await this.validateOrderDetail(detail, manager)
        }
    }
}
