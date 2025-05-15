import { Expose, plainToInstance } from 'class-transformer'
import { IsNumber, IsOptional, MaxLength } from 'class-validator'
import { UserDTO } from '../../user/dtos/user.dto'
import { removeUndefinedFields } from '../../../utils'

export class UpdateWarehouseRequest {
    @Expose()
    @MaxLength(50)
    @IsOptional()
    branchId: string

    @Expose()
    @IsNumber()
    warehouseId: number

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
