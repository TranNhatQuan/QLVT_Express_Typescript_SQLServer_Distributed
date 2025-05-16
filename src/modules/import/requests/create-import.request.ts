import { Expose, Type } from 'class-transformer'
import {
    ArrayMinSize,
    IsArray,
    IsEnum,
    IsIn,
    IsNotEmpty,
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
import { OrderDTO } from '../../order/dtos/order.dto'
import Container from 'typedi'
import { OrderService } from '../../order/services/order.service'

export class CreateImportDetailDTO {
    @Expose()
    importId?: string

    @Expose()
    @IsNumber()
    productId: number

    @Expose()
    @IsNumber()
    quantity: number
}

export class CreateImportRequest {
    @Expose()
    @IsNumber()
    orderId: number

    @Expose()
    @IsNumber()
    warehouseId: number

    @Expose()
    @IsNotEmpty()
    userId: string

    @Expose()
    @IsIn([DBType.HCM, DBType.HN])
    dbType: DBType

    @Expose()
    @Type(() => CreateImportDetailDTO)
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    details: CreateImportDetailDTO[]

    userAction?: UserDTO

    orderDetail: OrderDTO

    async validateDetail(
        detail: CreateImportDetailDTO,
        manager: EntityManager
    ) {
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
        this.orderDetail = await Container.get(OrderService).getOrderDetail(
            this.orderId,
            manager
        )

        for (const detail of this.details) {
            await this.validateOrderDetail(detail, manager)
        }
    }
}
