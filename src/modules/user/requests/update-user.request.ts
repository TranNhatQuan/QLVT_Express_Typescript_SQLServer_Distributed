import { Expose, plainToInstance } from 'class-transformer'
import { IsEnum, IsIn, IsNotEmpty, IsOptional } from 'class-validator'
import { BasePaginationReq } from '../../../base/base-pagination.req'
import { UserRole } from '../types/role.type'
import { removeUndefinedFields } from '../../../utils'
import { UserDTO } from '../dtos/user.dto'
import { DBType } from '../../../configs/types/application-constants.type'

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

    @Expose()
    @IsNotEmpty()
    userId: string

    @Expose()
    @IsIn([DBType.HCM, DBType.HN])
    dbType: DBType

    @Expose()
    userAction?: UserDTO

    getDataUpdate() {
        const data = removeUndefinedFields(
            plainToInstance(UpdateUserDTO, this, {
                excludeExtraneousValues: true,
            })
        )

        data.updatedBy = this.userAction.userId

        return data
    }
}

export class UpdateUserDTO {
    @Expose()
    branchId?: string

    @Expose()
    role?: UserRole

    @Expose()
    name?: string

    @Expose()
    address?: string

    @Expose()
    phone?: string

    @Expose()
    email?: string

    @Expose()
    updatedBy?: string
}
