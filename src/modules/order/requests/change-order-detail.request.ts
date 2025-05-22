import { Expose, Type } from 'class-transformer'
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
} from 'class-validator'
import { UserDTO } from '../../user/dtos/user.dto'
import { EntityManager } from 'typeorm'
import { Errors } from '../../../utils/error'
import { Product } from '../../product/entities/product.entity'
import { Order } from '../entities/order.entity'

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

export class ChangeOrderDetailRequest {
    @Expose()
    @IsString()
    @IsNotEmpty()
    orderId: string

    @Expose()
    @Type(() => OrderDetailDTO)
    @IsArray()
    @ValidateNested({ each: true })
    details: OrderDetailDTO[]

    @Expose()
    userAction?: UserDTO

    order: Order

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
        this.order = await manager.getRepository(Order).findOne({
            where: {
                orderId: this.orderId,
            },
        })

        if (!this.order) {
            throw Errors.OrderNotFound
        }

        for (const detail of this.details) {
            await this.validateOrderDetail(detail, manager)
        }
    }
}
