import { Inject, Service } from 'typedi'
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
import { SignInRequest } from '../requests/sign-in.request'
import bcrypt from 'bcrypt'
import { AuthService } from '../../auth/auth.service'
import { CacheKeys, CacheManager } from '../../../cache'

@Service()
export class UserService {
    constructor(
        @Inject() private authService: AuthService,
        @Inject() private cacheManager: CacheManager
    ) {}

    checkStatus(userEntity: User) {
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
            .createQueryBuilder('u')
            .where(removeUndefinedFields(filter))
            .select([
                'u.userId userId',
                'u.name name',
                'u.role role',
                'u.branchId branchId',
                'u.address address',
                'u.phone phone',
                'u.email email',
                'u.dob dob',
                'u.createdTime createdTime',
                'u.updatedTime updatedTime',
                'u.createdBy createdBy',
                'u.updatedBy updatedBy',
            ])

        const countQuery = query.clone()

        const [users, total] = await Promise.all([
            query
                .limit(req.pagination.limit)
                .offset(req.pagination.getOffset())
                .orderBy('u.role', 'DESC')
                .addOrderBy('u.createdTime', 'ASC')
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
        const user = await startTransaction(
            DBTypeMapping[req.dbType],
            async (manager) => {
                await req.validateRequest()

                req.password = bcrypt.hashSync(req.password, 10)

                const userEntity = plainToInstance(User, req, {
                    excludeExtraneousValues: true,
                })

                await userEntity.genId(manager)
                userEntity.setCreatedAndUpdatedBy(req.userAction.userId)

                await manager.insert(User, userEntity)

                userEntity.hideInfo()

                return userEntity
            }
        )

        return user
    }

    async deleteUser(req: DeleteUserRequest) {
        return await startTransaction(
            DBTypeMapping[req.dbType],
            async (manager) => {
                await req.validateRequest(manager)
                await manager.softDelete(User, { userId: req.userId })

                const accessTokenKey = CacheKeys.accessToken(req.userId)
                const refreshTokenKey = CacheKeys.refreshToken(req.userId)
                await Promise.all([
                    this.cacheManager.del(accessTokenKey),
                    this.cacheManager.del(refreshTokenKey),
                ])
            }
        )
    }

    async signOut(userId: string) {
        const accessTokenKey = CacheKeys.accessToken(userId)
        const refreshTokenKey = CacheKeys.refreshToken(userId)

        await Promise.all([
            this.cacheManager.del(accessTokenKey),
            this.cacheManager.del(refreshTokenKey),
        ])
    }

    async signIn(req: SignInRequest) {
        const user = await DBTypeMapping[req.dbType]
            .getRepository(User)
            .findOne({
                where: [{ userId: req.userId }],
            })
        this.checkStatus(user)

        if (!bcrypt.compareSync(req.password, user.password)) {
            throw Errors.InvalidAccount
        }

        const { accessToken, refreshToken } =
            await this.authService.generateAuthTokenPairs({
                userId: user.userId,
                role: user.role,
                branchId: user.branchId,
            })

        delete user.password

        return {
            user,
            accessToken,
            refreshToken,
        }
    }
}
