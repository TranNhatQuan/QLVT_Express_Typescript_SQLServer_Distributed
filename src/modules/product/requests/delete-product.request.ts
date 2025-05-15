import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { BasePaginationReq } from '../../../base/base-pagination.req'
import { UserDTO } from '../../user/dtos/user.dto'

export class DeleteBranchRequest extends BasePaginationReq {
    @Expose()
    @IsNotEmpty()
    branchId: string

    userAction: UserDTO
}
