import bcrypt from 'bcrypt'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken'
import { Inject, Service } from 'typedi'
import { EntityManager } from 'typeorm'
import { CacheKeys, CacheManager } from '../../cache'
import { Config } from '../../configs'
import { Errors } from '../../utils/error'

export const ACCESS_TOKEN_TYPE = 'access_token'
export const REFRESH_TOKEN_TYPE = 'refresh_token'

export class AuthPayload {
    userId: string
    roleId: number
    isVerified: boolean
    isActive: boolean
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

    async signToken(payload: AuthPayload, salt?: string) {
        const { accessSecret, accessExpiresIn } = this.config.jwt
        const jwtSecret = accessSecret + (salt ?? '')
        const sign = jwt.sign(payload, jwtSecret, {
            expiresIn: accessExpiresIn,
        })

        await this.cacheManager.set(
            CacheKeys.accessToken(payload.userId, sign),
            Date.now().toString(),
            accessExpiresIn
        )

        return this.generateAuthToken(sign)
    }

    async signTokenLongTime(payload: AuthPayload, salt?: string) {
        const { accessSecret, accessExpiresLongTime } = this.config.jwt
        const jwtSecret = accessSecret + (salt ?? '')
        const sign = jwt.sign(payload, jwtSecret, {
            expiresIn: accessExpiresLongTime,
        })

        await this.cacheManager.set(
            CacheKeys.accessToken(payload.userId, sign),
            Date.now().toString(),
            accessExpiresLongTime
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
        //const user = await UserRepos.getProfile(authPayload.userId);
        //UserRepos.checkStatus(user);
        //authPayload.username = user.username;

        // if (
        //   //user.allTokenExpiredAt &&
        //   plainPayload.iat * 1000 <=
        //   +new Date(user.allTokenExpiredAt)
        // ) {
        //   throw Errors.Unauthorized;
        // }

        // const jwtSecret = this.config.jwt.accessSecret + user.salt;

        // try {
        //   jwt.verify(token, jwtSecret);
        // } catch (err) {
        //   if (err instanceof JsonWebTokenError) {
        //     throw Errors.Unauthorized;
        //   }
        //   throw err;
        // }

        const cacheKey = CacheKeys.accessToken(authPayload.userId, token)
        const isTokenExisted = await this.cacheManager.exist(cacheKey)

        if (!isTokenExisted) {
            throw Errors.Unauthorized
        }

        return authPayload
    }

    async signRefreshToken(payload: AuthPayload, salt?: string) {
        const { refreshSecret, refreshExpiresIn } = this.config.jwt
        const jwtSecret = refreshSecret + (salt ?? '')
        const sign = jwt.sign(payload, jwtSecret, {
            expiresIn: refreshExpiresIn,
        })

        await this.cacheManager.set(
            CacheKeys.refreshToken(payload.userId, sign),
            Date.now().toString(),
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
        //const user = await UserRepos.getProfile(authPayload.userId);

        //UserRepos.checkStatus(user);

        // if (
        //   user.allTokenExpiredAt &&
        //   plainPayload.exp * 1000 <= +new Date(user.allTokenExpiredAt)
        // ) {
        //   throw Errors.Unauthorized;
        // }

        // const jwtSecret = this.config.jwt.refreshSecret + user.salt;

        // try {
        //   jwt.verify(token, jwtSecret);
        // } catch (err) {
        //   if (err instanceof JsonWebTokenError) {
        //     throw Errors.Unauthorized;
        //   }
        //   throw err;
        // }

        const cacheKey = CacheKeys.refreshToken(authPayload.userId, token)
        const isTokenExisted = await this.cacheManager.exist(cacheKey)

        if (!isTokenExisted) {
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

    async generateAuthTokenPairs(payload: AuthPayload, salt: string) {
        const res = await Promise.all([
            this.signToken(payload, salt),
            this.signRefreshToken(payload, salt),
        ])
        return {
            accessToken: res[0],
            refreshToken: res[1],
        }
    }
    async generateAccessTokenPairs(payload: AuthPayload, salt: string) {
        const res = await this.signTokenLongTime(payload, salt)
        return { accessToken: res }
    }

    async verifyUserPassword(
        userId: string,
        password: string,
        manager: EntityManager,
        onlyCheckExist = false,
        errOnFail = Errors.SelfActionPasswordIncorrect
    ) {
        if (!password?.length) {
            throw errOnFail
        }

        //const user = await manager.withRepository(UserRepos).findOneById(userId);
        //UserRepos.checkStatus(user, onlyCheckExist);

        // const isValidPassword = await bcrypt.compare(password, user.password);

        // if (!isValidPassword) {
        //   throw errOnFail;
        // }
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
