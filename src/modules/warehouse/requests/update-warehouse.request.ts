import { Expose, plainToInstance } from 'class-transformer'
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { BasePaginationReq } from '../../../base/base-pagination.req'
import { UserDTO } from '../../user/dtos/user.dto'
import { removeUndefinedFields } from '../../../utils'

export class UpdateBranchRequest extends BasePaginationReq {
    @Expose()
    @IsNotEmpty()
    branchId: string

    @Expose()
    @MaxLength(50)
    @IsOptional()
    name: string

    @Expose()
    @MaxLength(255)
    @IsOptional()
    address: string

    userAction?: UserDTO

    getDataUpdate() {
        const data = removeUndefinedFields(
            plainToInstance(UpdateBranchDTO, this, {
                excludeExtraneousValues: true,
            })
        )

        data.updatedBy = this.userAction.userId

        return data
    }
}

export class UpdateBranchDTO {
    @Expose()
    name?: string

    @Expose()
    address?: string

    @Expose()
    updatedBy?: string
}
