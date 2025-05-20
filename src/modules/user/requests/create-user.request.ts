import { Expose } from 'class-transformer'
import {
    IsDateString,
    IsEnum,
    IsIn,
    IsNotEmpty,
    IsOptional,
    MaxLength,
    MinLength,
} from 'class-validator'
import { BasePaginationReq } from '../../../base/base-pagination.req'
import { UserRole } from '../types/role.type'
import { DBType } from '../../../configs/types/application-constants.type'
import { UserDTO } from '../dtos/user.dto'
import { Errors } from '../../../utils/error'

export class CreateUserRequest extends BasePaginationReq {
    @Expose()
    @IsNotEmpty()
    branchId: string

    @Expose()
    @IsEnum(UserRole)
    role: UserRole

    @Expose()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
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
    @IsOptional()
    email?: string

    @Expose()
    @IsDateString()
    dob: Date

    @Expose()
    @IsIn([DBType.HCM, DBType.HN])
    dbType: DBType

    userAction?: UserDTO

    async validateRequest() {
        if (this.userAction.role < this.role) {
            throw Errors.Forbidden
        }

        if (DBType[this.branchId] !== this.dbType) {
            throw Errors.Forbidden
        }
    }
}
