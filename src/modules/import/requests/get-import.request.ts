import { Expose } from 'class-transformer'
import { IsIn, IsNotEmpty } from 'class-validator'
import { DBType } from '../../../configs/types/application-constants.type'
import { UserDTO } from '../../user/dtos/user.dto'

export class GetImportRequest {
    @Expose()
    @IsNotEmpty()
    importId: string

    @Expose()
    @IsIn([DBType.HCM, DBType.HN])
    dbType: DBType

    @Expose()
    userAction?: UserDTO
}
