import { Expose } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { BasePaginationReq } from '../../../base/base-pagination.req'
import { UserDTO } from '../../user/dtos/user.dto'

export class GetListCustomerRequest extends BasePaginationReq {
    @Expose()
    @IsOptional()
    customerId?: number

    @Expose()
    @IsOptional()
    search?: string

    @Expose()
    userAction?: UserDTO
}

export class CustomerFilter {
    @Expose()
    customerId?: number
}
