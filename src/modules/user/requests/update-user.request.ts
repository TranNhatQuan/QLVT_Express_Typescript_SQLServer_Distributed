import { Expose } from 'class-transformer'
import { IsEnum, IsOptional } from 'class-validator'
import { BasePaginationReq } from '../../../base/base-pagination.req'
import { UserRole } from '../types/role.type'

export class UpdateUserRequest extends BasePaginationReq {
    @Expose()
    @IsOptional()
    branchId?: string

    @Expose()
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole

    @Expose()
    @IsOptional()
    name?: string

    @Expose()
    @IsOptional()
    address?: string

    @Expose()
    @IsOptional()
    phone?: string

    @Expose()
    @IsOptional()
    email?: string
}

export class UpdateUserDTO {}
