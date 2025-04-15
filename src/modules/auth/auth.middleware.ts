import { NextFunction, Request, Response } from 'express'
import { Inject, Service } from 'typedi'
import { Errors } from '../../utils/error'
import { AuthService } from './auth.service'
import { Config } from '../../configs'

export interface AuthRequest extends Request {
    userId: string
    roleId: number
    accessToken: string
    username: string
}

@Service()
export class AuthMiddleware {
    constructor(
        @Inject() private authService: AuthService,
        @Inject() private config: Config
    ) {}

    async authorize(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const token = getAuthHeader(req)

            if (!token) {
                throw Errors.Unauthorized
            }

            const payload = await this.authService.verifyToken(token)
            req.userId = payload.userId
            req.roleId = payload.roleId
            req.accessToken = token
            req.username = payload.username

            next()
        } catch (err) {
            next(err)
        }
    }

    async authorizeIfNeeded(
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const token = getAuthHeader(req)

            if (token) {
                const payload = await this.authService.verifyToken(token)
                req.userId = payload.userId
                req.roleId = payload.roleId
                req.accessToken = token
                req.username = payload.username
            }

            next()
        } catch (err) {
            next(err)
        }
    }

    async verifyBeApiKey(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const token = getBeApiKeyHeader(req)

            if (!token || token !== this.config.beApiKey) {
                throw Errors.BeApiKeyInvalid
            }

            next()
        } catch (err) {
            next(err)
        }
    }

    async verifyDepositApiKey(
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const key = req.headers['deposit-api-key']

            if (!key || key !== this.config.depositApiKey) {
                throw Errors.BadRequest
            }

            next()
        } catch (err) {
            next(err)
        }
    }
}

export const getAuthHeader = (req: Request) => {
    const authHeader = req.headers['authorization']
    return authHeader?.split(' ').at(1)
}

const getBeApiKeyHeader = (req: Request) => {
    return req.headers['be-api-key']
}
