import { Expose } from 'class-transformer'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { BasePaginationReq } from '../../../base/base-pagination.req'
import { UserRole } from '../types/role.type'

export class CreateUserRequest extends BasePaginationReq {
    @Expose()
    @IsNotEmpty()
    branchId: string

    @Expose()
    @IsEnum(UserRole)
    role: UserRole

    @Expose()
    @IsNotEmpty()
    username: string

    @Expose()
    @IsNotEmpty()
    password: string

    @Expose()
    @IsNotEmpty()
    name: string

    @Expose()
    @IsNotEmpty()
    address: string

    @Expose()
    @IsNotEmpty()
    phone: string

    @Expose()
    @IsNotEmpty()
    email: string
}
