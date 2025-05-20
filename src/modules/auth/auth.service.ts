import { instanceToPlain, plainToInstance } from 'class-transformer'
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken'
import { Inject, Service } from 'typedi'
import { CacheKeys, CacheManager } from '../../cache'
import { Config } from '../../configs'
import { Errors } from '../../utils/error'
import { UserRole } from '../user/types/role.type'

export const ACCESS_TOKEN_TYPE = 'access_token'
export const REFRESH_TOKEN_TYPE = 'refresh_token'

export class AuthPayload {
    userId: string
    role: UserRole
    branchId?: string
    username?: string
}

export interface AuthToken {
    token: string
    expireAt: number
}

export class OTPPayload {
    phoneNumber: string
    otp: string
}

@Service()
export class AuthService {
    constructor(
        @Inject() private config: Config,
        @Inject() private cacheManager: CacheManager
    ) {}

    async signToken(payload: AuthPayload) {
        const { accessSecret, accessExpiresIn } = this.config.jwt
        const jwtSecret = accessSecret
        const sign = jwt.sign(payload, jwtSecret, {
            expiresIn: accessExpiresIn,
        })

        await this.cacheManager.set(
            CacheKeys.accessToken(payload.userId),
            sign,
            accessExpiresIn
        )

        return this.generateAuthToken(sign)
    }

    async verifyToken(token: string) {
        const decoded = jwt.decode(token, {
            complete: true,
        })

        if (!decoded) {
            throw Errors.Unauthorized
        }

        const plainPayload = instanceToPlain(decoded.payload)
        const authPayload = plainToInstance(AuthPayload, plainPayload)

        const jwtSecret =
            this.config.jwt.accessSecret + this.config.saltPassword
        try {
            jwt.verify(token, jwtSecret)
        } catch (err) {
            if (err instanceof JsonWebTokenError) {
                throw Errors.Unauthorized
            }
            throw err
        }

        const cacheKey = CacheKeys.accessToken(authPayload.userId)
        const key = await this.cacheManager.get(cacheKey)

        if (!key && key !== token) {
            throw Errors.Unauthorized
        }

        return authPayload
    }

    async signRefreshToken(payload: AuthPayload) {
        const { refreshSecret, refreshExpiresIn } = this.config.jwt
        const jwtSecret = refreshSecret
        const sign = jwt.sign(payload, jwtSecret, {
            expiresIn: refreshExpiresIn,
        })

        await this.cacheManager.set(
            CacheKeys.refreshToken(payload.userId),
            sign,
            refreshExpiresIn
        )

        return this.generateAuthToken(sign)
    }

    async verifyRefreshToken(token: string) {
        const decoded = jwt.decode(token, {
            complete: true,
        })

        if (!decoded) {
            throw Errors.Unauthorized
        }

        const plainPayload = instanceToPlain(decoded.payload)
        const authPayload = plainToInstance(AuthPayload, plainPayload)

        const jwtSecret =
            this.config.jwt.refreshSecret + this.config.saltPassword

        try {
            jwt.verify(token, jwtSecret)
        } catch (err) {
            if (err instanceof JsonWebTokenError) {
                throw Errors.Unauthorized
            }
            throw err
        }

        const cacheKey = CacheKeys.refreshToken(authPayload.userId)
        const key = await this.cacheManager.get(cacheKey)

        if (!key && key !== token) {
            throw Errors.Unauthorized
        }

        return authPayload
    }

    private generateAuthToken(sign: string): AuthToken {
        const decoded = jwt.decode(sign, { complete: true })
        const decodedPayload = decoded.payload as JwtPayload
        return {
            token: sign,
            expireAt: decodedPayload.exp,
        }
    }

    async generateAuthTokenPairs(payload: AuthPayload) {
        const res = await Promise.all([
            this.signToken(payload),
            this.signRefreshToken(payload),
        ])
        return {
            accessToken: res[0],
            refreshToken: res[1],
        }
    }

    getPayloadFromJwt(token: string) {
        const decoded = jwt.decode(token, {
            complete: true,
        })

        if (!decoded) {
            throw Errors.Unauthorized
        }

        const plainPayload = instanceToPlain(decoded.payload)

        return plainToInstance(AuthPayload, plainPayload)
    }
}
