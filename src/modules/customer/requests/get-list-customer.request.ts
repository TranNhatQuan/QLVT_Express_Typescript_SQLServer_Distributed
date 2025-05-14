import { Expose } from 'class-transformer'
import { IsIn, IsOptional } from 'class-validator'
import { BasePaginationReq } from '../../../base/base-pagination.req'
import { DBType } from '../../../configs/types/application-constants.type'

export class GetListCustomerRequest extends BasePaginationReq {
    @Expose()
    @IsOptional()
    customerId?: number

    @Expose()
    @IsOptional()
    search?: string

    @Expose()
    @IsIn([DBType.HCM, DBType.HN, DBType.MASTER])
    dbType: DBType
}

export class CustomerFilter {
    @Expose()
    customerId?: number
}
