import { Expose } from 'class-transformer'
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { BasePaginationReq } from '../../../base/base-pagination.req'
import { UserDTO } from '../../user/dtos/user.dto'

export class CreateCustomerRequest extends BasePaginationReq {
    @Expose()
    @MaxLength(250)
    @IsNotEmpty()
    phone: string

    @Expose()
    @MaxLength(50)
    @IsNotEmpty()
    name: string

    @Expose()
    @MaxLength(255)
    @IsNotEmpty()
    address: string

    @Expose()
    @IsOptional()
    email?: string

    @Expose()
    @IsOptional()
    @MaxLength(255)
    note?: string

    userAction?: UserDTO
}
