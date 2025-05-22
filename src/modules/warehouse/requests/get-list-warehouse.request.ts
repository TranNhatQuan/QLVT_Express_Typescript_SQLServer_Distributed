import { Expose, Transform } from 'class-transformer'
import { IsIn, IsOptional } from 'class-validator'
import { BasePaginationReq } from '../../../base/base-pagination.req'
import { FindOperator, Like } from 'typeorm'
import { DBType } from '../../../configs/types/application-constants.type'
import { UserDTO } from '../../user/dtos/user.dto'

export class GetListWarehouseRequest extends BasePaginationReq {
    @Expose()
    @IsOptional()
    branchId?: string

    @Expose()
    @IsOptional()
    name?: string

    @Expose()
    @IsOptional()
    warehouseId?: number

    @Expose()
    @IsOptional()
    searchAddress?: string

    @Expose()
    @IsIn([DBType.HCM, DBType.HN])
    dbType: DBType

    @Expose()
    userAction?: UserDTO
}

export class WarehouseFilter {
    @Expose()
    branchId?: string

    @Expose()
    name?: string

    @Expose()
    warehouseId?: number

    @Expose()
    @Transform((source) => {
        const data = source.obj

        if (data.searchAddress) {
            return Like(data.searchAddress + '%')
        }

        return data.searchAddress
    })
    address?: FindOperator<string>
}
