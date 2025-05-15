import { Expose, Transform } from 'class-transformer'
import { IsEnum, IsOptional } from 'class-validator'
import { BasePaginationReq } from '../../../base/base-pagination.req'
import { UserRole } from '../types/role.type'
import { FindOperator, Like } from 'typeorm'

export class GetListUserRequest extends BasePaginationReq {
    @Expose()
    @IsOptional()
    branchId?: string

    @Expose()
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole

    @Expose()
    @IsOptional()
    userId?: string

    @Expose()
    @IsOptional()
    searchName?: string
}

export class UserFilter {
    @Expose()
    branchId?: string

    @Expose()
    role?: UserRole

    @Expose()
    userId?: string

    @Expose()
    @Transform((source) => {
        const data = source.obj

        if (data.searchName) {
            return Like(data.searchName + '%')
        }

        return data.name
    })
    name?: FindOperator<string>
}
