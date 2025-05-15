import { Expose, Type } from 'class-transformer'
import {
    ArrayMinSize,
    IsArray,
    IsEnum,
    IsIn,
    IsNumber,
    IsOptional,
    ValidateNested,
} from 'class-validator'
import { UserDTO } from '../../user/dtos/user.dto'
import { OrderStatus } from '../types/order-status.type'
import { OrderType } from '../types/order.type'
import { EntityManager } from 'typeorm'
import { Errors } from '../../../utils/error'
import { Warehouse } from '../../warehouse/entities/warehouse.entity'
import { Customer } from '../../customer/entities/customer.entity'
import { Product } from '../../product/entities/product.entity'
import { DBType } from '../../../configs/types/application-constants.type'

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
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus

    @Expose()
    userId: string

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
    @IsIn([DBType.HCM, DBType.HN])
    dbType: DBType

    @Expose()
    @Type(() => OrderDetailDTO)
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    details: OrderDetailDTO[]

    userAction?: UserDTO
    sourceWarehouse: Warehouse
    destinationWarehouse: Warehouse
    customer: Customer

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

        for (const detail of this.details) {
            await this.validateOrderDetail(detail, manager)
        }
    }

    getDataSource() {
        if (this.type !== OrderType.Transfer) {
            return this.dbType
        }

        if (
            this.sourceWarehouse.branchId !== this.destinationWarehouse.branchId
        ) {
            return DBType.MASTER
        }

        return this.dbType
    }
}
