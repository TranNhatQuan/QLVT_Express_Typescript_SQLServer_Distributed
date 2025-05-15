import { Expose, plainToInstance } from 'class-transformer'
import { IsNumber, IsOptional, MaxLength } from 'class-validator'
import { BasePaginationReq } from '../../../base/base-pagination.req'
import { UserDTO } from '../../user/dtos/user.dto'
import { removeUndefinedFields } from '../../../utils'

export class UpdateProductRequest extends BasePaginationReq {
    @Expose()
    @IsNumber()
    productId: string

    @Expose()
    @MaxLength(50)
    @IsOptional()
    name?: string

    @Expose()
    @MaxLength(50)
    @IsOptional()
    unit?: string

    userAction?: UserDTO

    getDataUpdate() {
        const data = removeUndefinedFields(
            plainToInstance(UpdateProductDTO, this, {
                excludeExtraneousValues: true,
            })
        )

        data.updatedBy = this.userAction.userId

        return data
    }
}

export class UpdateProductDTO {
    @Expose()
    name?: string

    @Expose()
    unit?: string

    @Expose()
    updatedBy?: string
}
