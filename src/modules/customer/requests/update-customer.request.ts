import { Expose, plainToInstance, Transform } from 'class-transformer'
import { IsNumber, IsOptional, MaxLength } from 'class-validator'
import { BasePaginationReq } from '../../../base/base-pagination.req'
import { UserDTO } from '../../user/dtos/user.dto'
import { removeUndefinedFields } from '../../../utils'
import { ToNumber } from '../../../utils/transform'

export class UpdateCustomerRequest extends BasePaginationReq {
    @Expose()
    @IsNumber()
    @Transform(ToNumber)
    customerId: number

    @Expose()
    @MaxLength(250)
    @IsOptional()
    phone?: string

    @Expose()
    @MaxLength(50)
    @IsOptional()
    name?: string

    @Expose()
    @MaxLength(255)
    @IsOptional()
    address?: string

    @Expose()
    @IsOptional()
    email?: string

    @Expose()
    @IsOptional()
    @MaxLength(255)
    note?: string

    @Expose()
    userAction?: UserDTO

    getDataUpdate() {
        const data = removeUndefinedFields(
            plainToInstance(UpdateCustomerDTO, this, {
                excludeExtraneousValues: true,
            })
        )

        data.updatedBy = this.userAction.userId

        return data
    }
}

export class UpdateCustomerDTO {
    @Expose()
    name?: string

    @Expose()
    address?: string

    @Expose()
    note?: string

    @Expose()
    email?: string

    @Expose()
    phone?: string

    @Expose()
    updatedBy?: string
}
