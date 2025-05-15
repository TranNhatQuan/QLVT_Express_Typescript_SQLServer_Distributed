import { Expose, Transform } from 'class-transformer'
import { IsIn, IsOptional } from 'class-validator'
import { BasePaginationReq } from '../../../base/base-pagination.req'
import { FindOperator, Like } from 'typeorm'
import { DBType } from '../../../configs/types/application-constants.type'

export class GetListBranchRequest extends BasePaginationReq {
    @Expose()
    @IsOptional()
    branchId?: string

    @Expose()
    @IsOptional()
    searchAddress?: string

    @Expose()
    @IsIn([DBType.HCM, DBType.HN])
    dbType: DBType
}

export class BranchFilter {
    @Expose()
    branchId?: string

    @Expose()
    @Transform((source) => {
        const data = source.obj

        if (data.searchAddress) {
            return Like(data.searchAddress + '%')
        }

        return data.address
    })
    address?: FindOperator<string>
}
