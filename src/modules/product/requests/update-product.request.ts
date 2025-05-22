import { Expose, plainToInstance, Transform } from 'class-transformer'
import { IsNumber, IsOptional, MaxLength } from 'class-validator'
import { BasePaginationReq } from '../../../base/base-pagination.req'
import { UserDTO } from '../../user/dtos/user.dto'
import { removeUndefinedFields } from '../../../utils'
import { ToNumber } from '../../../utils/transform'

export class UpdateProductRequest extends BasePaginationReq {
    @Expose()
    @IsNumber()
    @Transform(ToNumber)
    productId: string

    @Expose()
    @MaxLength(50)
    @IsOptional()
    name?: string

    @Expose()
    @MaxLength(50)
    @IsOptional()
    unit?: string

    @Expose()
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
