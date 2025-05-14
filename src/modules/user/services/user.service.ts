import { Service } from 'typedi'
import { User } from '../entities/user.entity'
import { Errors } from '../../../utils/error'
import {
    GetListUserRequest,
    UserFilter,
} from '../requests/get-list-user.request'
import { plainToInstance } from 'class-transformer'
import { AppDataSources, startTransaction } from '../../../database/connection'
import { removeUndefinedFields } from '../../../utils'
import { UpdateUserRequest } from '../requests/update-user.request'
import { CreateUserRequest } from '../requests/create-user.request'
import { DBTypeMapping } from '../../../configs/types/application-constants.type'
import { DeleteUserRequest } from '../requests/delete-user.request'

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

    async updateUser(req: UpdateUserRequest) {
        await startTransaction(DBTypeMapping[req.dbType], async (manager) => {
            manager.update(User, req.userId, req.getDataUpdate())
        })

        return true
    }

    async createUser(req: CreateUserRequest) {
        return await startTransaction(
            DBTypeMapping[req.dbType],
            async (manager) => {
                const userEntity = plainToInstance(User, req, {
                    excludeExtraneousValues: true,
                })

                await req.validateRequest()

                userEntity.genId()
                userEntity.setCreatedAndUpdatedBy(req.userAction.userId)

                await manager.insert(User, userEntity)

                return userEntity
            }
        )
    }

    async deleteUser(req: DeleteUserRequest) {
        return await startTransaction(
            DBTypeMapping[req.dbType],
            async (manager) => {
                await req.validateRequest(manager)
                await manager.softDelete(User, { userId: req.userId })
            }
        )
    }
}
