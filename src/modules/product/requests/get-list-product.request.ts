import { Expose, Transform } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional } from 'class-validator'
import { BasePaginationReq } from '../../../base/base-pagination.req'
import { UserDTO } from '../../user/dtos/user.dto'
import { FindOperator, Like } from 'typeorm'
import { DBType } from '../../../configs/types/application-constants.type'

export class GetListProductRequest extends BasePaginationReq {
    @Expose()
    @IsNumber()
    @IsOptional()
    productId?: number

    @Expose()
    @IsOptional()
    searchName?: string

    @Expose()
    @IsOptional()
    unit?: string

    @Expose()
    userAction?: UserDTO

    @Expose()
    @IsEnum(DBType)
    dbType: DBType
}

export class ProductFilter {
    @Expose()
    productId?: number

    @Expose()
    @Transform((source) => {
        const data = source.obj

        if (data.searchName) {
            return Like(data.searchName + '%')
        }

        return data.name
    })
    name?: FindOperator<string>
}
