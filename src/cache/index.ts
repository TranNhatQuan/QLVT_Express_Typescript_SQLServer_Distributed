import { ClassConstructor, plainToInstance } from 'class-transformer'
import { Redis } from 'ioredis'
import { Inject, Service } from 'typedi'
import { Config } from '../configs'

export const CacheKeys = {
    accessToken: (userId: string) => `access-token:${userId}`,

    refreshToken: (userId: string) => `refresh-token:${userId}`,

    user: (userId: string) => `user:${userId}`,

    failedLogin: (userId: string) => `failed-login-user:${userId}`,

    forgotPasswordOtp: (userId: string) => `forgot-password-otp:${userId}`,

    userOtpUsage: (userId: string) => `user-otp-usage:${userId}`,
}

export const CacheTimes = {
    day: (time = 1) => {
        return time * CacheTimes.hour(24)
    },
    hour: (time = 1) => {
        return time * CacheTimes.minute(60)
    },
    minute: (time = 1) => time * 60,
}

@Service()
export class CacheManager {
    private redisClient: Redis

    constructor(@Inject() private config: Config) {
        this.redisClient = new Redis(this.config.redis)
    }

    getInstanceRedis() {
        return this.redisClient
    }

    async check() {
        await this.redisClient.ping()
    }

    async get(key: string): Promise<string> {
        return this.redisClient.get(key)
    }

    async keys(keyPattern: string) {
        return this.redisClient.keys(keyPattern)
    }

    async set(key: string, value: string, ttl?: number): Promise<void> {
        await this.redisClient.set(key, value)
        if (ttl) {
            await this.redisClient.expire(key, ttl)
        }
    }

    async getObject<T>(cls: ClassConstructor<T>, key: string): Promise<T> {
        const res = await this.get(key)

        return plainToInstance(cls, JSON.parse(res), {
            excludeExtraneousValues: true,
        })
    }

    async getArrayObjects<T>(
        cls: ClassConstructor<T>,
        key: string
    ): Promise<T[]> {
        const res = await this.get(key)

        return plainToInstance(cls, <unknown[]>JSON.parse(res), {
            excludeExtraneousValues: true,
        })
    }

    async setObject(key: string, object: unknown, ttl?: number) {
        await this.set(key, JSON.stringify(object), ttl)
    }

    async del(key: string): Promise<number> {
        return this.redisClient.del(key)
    }

    async exist(key: string) {
        return this.redisClient.exists(key)
    }

    async hget(key: string, field: string) {
        return this.redisClient.hget(key, field)
    }

    async hset(key: string, field: string, value: string) {
        await this.redisClient.hset(key, field, value)
    }

    async hgetall(key: string) {
        return await this.redisClient.hgetall(key)
    }

    async hmset(key: string, obj: object, ttl?: number) {
        await this.redisClient.hmset(key, obj)
        if (ttl) {
            await this.redisClient.expire(key, ttl)
        }
    }

    async hexists(key: string, field: string) {
        return await this.redisClient.hexists(key, field)
    }

    async hdel(key: string, fields: string[]): Promise<number> {
        return await this.redisClient.hdel(key, ...fields)
    }
}
