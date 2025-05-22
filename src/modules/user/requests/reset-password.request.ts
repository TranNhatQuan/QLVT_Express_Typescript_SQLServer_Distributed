import { Expose } from 'class-transformer'
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator'
import { BasePaginationReq } from '../../../base/base-pagination.req'
import { Errors } from '../../../utils/error'
import { UserRole } from '../types/role.type'
import { UserDTO } from '../dtos/user.dto'

export class ChangePasswordRequest extends BasePaginationReq {
    @Expose()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    oldPassword: string

    @Expose()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    newPassword: string

    @Expose()
    @IsOptional()
    userId?: string

    @Expose()
    userAction: UserDTO

    async validateRequest() {
        if (this.oldPassword === this.newPassword) {
            throw Errors.PasswordNotChanged
        }

        if (
            this.userId != this.userAction.userId &&
            this.userAction.role === UserRole.Staff
        ) {
            throw Errors.Forbidden
        }
    }
}
