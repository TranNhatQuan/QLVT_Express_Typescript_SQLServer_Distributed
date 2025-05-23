import { Expose, Type } from 'class-transformer'
import {
    ArrayMinSize,
    IsArray,
    IsNotEmpty,
    IsNumber,
    ValidateNested,
} from 'class-validator'
import { UserDTO } from '../../user/dtos/user.dto'
import { EntityManager } from 'typeorm'
import { Errors } from '../../../utils/error'
import { OrderDTO } from '../../order/dtos/order.dto'
import Container from 'typedi'
import { OrderService } from '../../order/services/order.service'
import { OrderStatus } from '../../order/types/order-status.type'
import { Warehouse } from '../../warehouse/entities/warehouse.entity'
import { OrderType } from '../../order/types/order.type'

export class CreateExportDetailDTO {
    @Expose()
    importId?: string

    @Expose()
    @IsNumber()
    productId: number

    @Expose()
    @IsNumber()
    quantity: number
}

export class CreateExportRequest {
    @Expose()
    @IsNotEmpty()
    orderId: string

    @Expose()
    @Type(() => CreateExportDetailDTO)
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    details: CreateExportDetailDTO[]

    @Expose()
    userAction?: UserDTO

    warehouseId?: number
    warehouse?: Warehouse
    orderDetail: OrderDTO

    validateDetail(detail: CreateExportDetailDTO) {
        const orderProductDetail = this.orderDetail.details.find(
            (u) => u.productId === detail.productId
        )

        if (!orderProductDetail) throw Errors.InvalidData

        let quantity = 0

        this.orderDetail.exportDetails.forEach((item) => {
            const product = item.details.find(
                (u) => u.productId === detail.productId
            )

            if (product) {
                quantity += product.quantity
            }
        })

        if (quantity + detail.quantity > orderProductDetail.quantity)
            throw Errors.InvalidData
    }

    async validateRequest(manager: EntityManager) {
        this.orderDetail = await Container.get(OrderService).getOrderDetail(
            this.orderId,
            manager
        )

        if (
            this.orderDetail.status !== OrderStatus.InProgress ||
            this.orderDetail.type === OrderType.Import ||
            this.orderDetail.exportDone
        )
            throw Errors.InvalidData

        this.warehouse = await manager.getRepository(Warehouse).findOne({
            where: {
                warehouseId: this.orderDetail.sourceWarehouseId,
            },
        })

        this.warehouseId = this.warehouse.warehouseId

        if (this.warehouse.branchId !== this.userAction.branchId)
            throw Errors.Forbidden

        this.details.forEach((detail) => {
            this.validateDetail(detail)
        })
    }
}
