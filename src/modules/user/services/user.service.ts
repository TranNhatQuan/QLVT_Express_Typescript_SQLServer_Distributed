import { Service } from 'typedi'
import { User } from '../entities/user.entity'
import { Errors } from '../../../utils/error'
import {
    GetListUserRequest,
    UserFilter,
} from '../requests/get-list-user.request'
import { plainToInstance } from 'class-transformer'
import { AppDataSources } from '../../../database/connection'
import { removeUndefinedFields } from '../../../utils'

@Service()
export class UserService {
    checkUserStatus(userEntity: User) {
        if (!userEntity) {
            throw Errors.UserNotFound
        }
    }

    async getListUser(req: GetListUserRequest) {
        const filter = plainToInstance(UserFilter, req, {
            excludeExtraneousValues: true,
        })

        const query = AppDataSources.shardUser
            .getRepository(User)
            .createQueryBuilder()
            .from(User, 'u')
            .where(removeUndefinedFields(filter))

        const countQuery = query.clone()

        const [users, total] = await Promise.all([
            query
                .limit(req.pagination.limit)
                .offset(req.pagination.getOffset())
                .orderBy('u.role', 'DESC')
                .addOrderBy('u.createdAt', 'ASC')
                .getRawMany(),
            countQuery.getCount(),
        ])

        req.pagination.total = total

        return users
    }
}
