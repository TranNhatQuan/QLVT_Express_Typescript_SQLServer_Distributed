import { Expose } from 'class-transformer'
import { IsIn, IsNotEmpty } from 'class-validator'
import { BasePaginationReq } from '../../../base/base-pagination.req'
import { UserDTO } from '../dtos/user.dto'
import { DBType } from '../../../configs/types/application-constants.type'
import { EntityManager } from 'typeorm'
import { AppDataSources } from '../../../database/connection'
import { User } from '../entities/user.entity'
import { Errors } from '../../../utils/error'

export class DeleteUserRequest extends BasePaginationReq {
    @Expose()
    @IsNotEmpty()
    userId: string

    @Expose()
    @IsIn([DBType.HCM, DBType.HN])
    dbType: DBType

    @Expose()
    userAction: UserDTO

    user: User

    async validateRequest(
        mannager: EntityManager = AppDataSources.master.manager
    ) {
        this.user = await mannager.findOneBy(User, {
            userId: this.userId,
        })

        if (!this.user) {
            throw Errors.UserNotFound
        }

        if (this.user.role > this.userAction.role) {
            throw Errors.Forbidden
        }
    }
}
