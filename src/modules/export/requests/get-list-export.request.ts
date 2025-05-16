import { Expose } from 'class-transformer'
import { IsIn, IsNumber, IsOptional } from 'class-validator'
import { BasePaginationReq } from '../../../base/base-pagination.req'
import { DBType } from '../../../configs/types/application-constants.type'
export class GetListImportRequest extends BasePaginationReq {
    @Expose()
    @IsOptional()
    orderId?: string

    @Expose()
    @IsOptional()
    importId?: string

    @Expose()
    @IsOptional()
    @IsNumber()
    productId?: number

    @Expose()
    @IsOptional()
    branchId?: string

    @Expose()
    @IsIn([DBType.HCM, DBType.HN])
    dbType: DBType
}

export class ImportFilter {
    @Expose()
    orderId?: string

    @Expose()
    importId?: string
}
