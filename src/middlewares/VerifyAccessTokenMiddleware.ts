import * as express from 'express'
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers'
import { Inject, Service } from 'typedi'
import { getAuthHeader } from '../modules/auth/auth.middleware'
import { AuthService } from '../modules/auth/auth.service'
import { Errors } from '../utils/error'
import _ from 'lodash'
import { AppDataSources } from '../database/connection'
import { User } from '../modules/user/entities/user.entity'
import { plainToInstance } from 'class-transformer'
import { UserDTO } from '../modules/user/dtos/user.dto'

@Service()
@Middleware({ type: 'before' })
export class VerifyAccessTokenMiddleware implements ExpressMiddlewareInterface {
    constructor(@Inject() protected authService: AuthService) {}

    public async use(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const token = getAuthHeader(req)

        if (!token) {
            throw Errors.Unauthorized
        }

        const payload = await this.authService.verifyToken(token)

        const user = AppDataSources.shardUser
            .createQueryBuilder()
            .from(User, 'u')
            .where({
                userId: payload.userId,
            })

        _.assign(req, {
            userId: payload.userId,
            roleId: payload.roleId,
            accessToken: token,
            username: payload.username,
            userAction: plainToInstance(UserDTO, user, {
                excludeExtraneousValues: true,
            }),
        })

        return next()
    }
}
