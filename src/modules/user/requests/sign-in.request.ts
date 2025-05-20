import { Expose } from 'class-transformer'
import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { DBType } from '../../../configs/types/application-constants.type'
export class SignInRequest {
    @Expose()
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    userId: string

    @Expose()
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    password: string

    @Expose()
    @IsIn([DBType.HCM, DBType.HN])
    dbType: DBType
}
