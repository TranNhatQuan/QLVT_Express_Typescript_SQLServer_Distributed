import { Expose, plainToInstance, Transform } from 'class-transformer'
import { IsNumber, IsOptional, MaxLength } from 'class-validator'
import { UserDTO } from '../../user/dtos/user.dto'
import { removeUndefinedFields } from '../../../utils'
import { ToNumber } from '../../../utils/transform'

export class UpdateWarehouseRequest {
    @Expose()
    @IsNumber()
    @Transform(ToNumber)
    warehouseId: number

    @Expose()
    @MaxLength(50)
    @IsOptional()
    name: string

    @Expose()
    @MaxLength(255)
    @IsOptional()
    address: string

    @Expose()
    userAction?: UserDTO

    getDataUpdate() {
        const data = removeUndefinedFields(
            plainToInstance(UpdateWarehouseDTO, this, {
                excludeExtraneousValues: true,
            })
        )

        data.updatedBy = this.userAction.userId

        return data
    }
}

export class UpdateWarehouseDTO {
    @Expose()
    name?: string

    @Expose()
    address?: string

    @Expose()
    updatedBy?: string

    @Expose()
    branchId?: string
}
