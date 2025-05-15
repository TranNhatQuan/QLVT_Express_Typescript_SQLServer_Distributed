import { Expose } from 'class-transformer'
import { IsEnum, IsIn, IsNumber, IsOptional } from 'class-validator'
import { BasePaginationReq } from '../../../base/base-pagination.req'
import { DBType } from '../../../configs/types/application-constants.type'
import { OrderType } from '../types/order.type'
import { OrderStatus } from '../types/order-status.type'

export class GetListOrderRequest extends BasePaginationReq {
    @Expose()
    @IsOptional()
    orderId?: string

    @Expose()
    @IsOptional()
    @IsEnum(OrderType)
    type?: OrderType

    @Expose()
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus

    @Expose()
    @IsOptional()
    userId?: string

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
    @IsOptional()
    branchId?: string

    @Expose()
    @IsIn([DBType.HCM, DBType.HN])
    dbType: DBType
}

export class OrderFilter {
    @Expose()
    orderId?: string

    @Expose()
    type?: OrderType

    @Expose()
    status?: OrderStatus

    @Expose()
    userId?: string

    @Expose()
    sourceWarehouseId?: number

    @Expose()
    destinationWarehouseId?: number

    @Expose()
    customerId?: number
}
