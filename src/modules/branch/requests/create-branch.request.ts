import { Expose } from 'class-transformer'
import { IsNotEmpty, MaxLength } from 'class-validator'
import { BasePaginationReq } from '../../../base/base-pagination.req'
import { UserDTO } from '../../user/dtos/user.dto'

export class CreateBranchRequest extends BasePaginationReq {
    @Expose()
    @MaxLength(50)
    @IsNotEmpty()
    branchId: string

    @Expose()
    @MaxLength(50)
    @IsNotEmpty()
    name: string

    @Expose()
    @MaxLength(255)
    @IsNotEmpty()
    address: string

    @Expose()
    userAction?: UserDTO
}
