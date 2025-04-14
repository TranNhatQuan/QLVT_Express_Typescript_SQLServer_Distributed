import { plainToInstance, Type } from 'class-transformer'
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
    validateSync,
} from 'class-validator'
import Container, { Service } from 'typedi'
import { AwsConfig } from './aws.config'
import { BetMakerConfig } from './bet-maker.config'
import { MySqlDataSourceConfig } from './db.config'
import { FatZebraConfig } from './fat-zebra.config'
import { FrankieOneConfig } from './frankie-one.config'
import { FreshsalesConfig } from './freshsales.config'
import { JwtConfig } from './jwt.config'
import { MailConfig } from './mail.config'
import { RedisConfig } from './redis.config'
import { SnsConfig } from './sns.config'
import { BetStopConfig } from './bet-stop.config'
import { SandboxConfig } from './sandbox.config'
import { PaypalConfig } from './paypal.config'
import { FCMConfig } from './fcm.config'
import { IntercomConfig } from './intercom.config'
import { SentryConfig } from './sentry.config'
import { ClassicRemoteBetYourselfOddsConfig } from './classic-remote-bet-yourself-odds.config'
import { TwilioConfig } from './twilio.config'
@Service()
export class Config {
    @IsString()
    @IsNotEmpty()
    nodeEnv: string

    @IsNumber()
    @IsNotEmpty()
    port: number

    @ValidateNested()
    @Type(() => MySqlDataSourceConfig)
    masterDb: MySqlDataSourceConfig

    @ValidateNested({ each: true })
    @Type(() => MySqlDataSourceConfig)
    slavesDb: MySqlDataSourceConfig[]

    // @ValidateNested()
    // @Type(() => MySqlDataSourceConfig)
    // bettingPlatformMasterDb: MySqlDataSourceConfig
    //
    // @ValidateNested({ each: true })
    // @Type(() => MySqlDataSourceConfig)
    // bettingPlatformSlavesDb: MySqlDataSourceConfig[]

    @ValidateNested()
    @Type(() => RedisConfig)
    redis: RedisConfig

    @ValidateNested()
    @Type(() => JwtConfig)
    jwt: JwtConfig

    @IsString()
    basicAuthPassword: string

    @ValidateNested()
    @Type(() => AwsConfig)
    awsConfig: AwsConfig

    @ValidateNested()
    @Type(() => MailConfig)
    mailConfig: MailConfig

    @ValidateNested()
    @Type(() => SnsConfig)
    snsConfig: SnsConfig

    @IsNumber()
    @IsNotEmpty()
    blockAfterLoginFails: number

    @IsNumber()
    @IsNotEmpty()
    maximumOtpTimes: number

    @IsNumber()
    @IsNotEmpty()
    otpExpiredTime: number

    @ValidateNested()
    @Type(() => FreshsalesConfig)
    freshsalesConfig: FreshsalesConfig

    @ValidateNested()
    @Type(() => BetMakerConfig)
    betMakerConfig: BetMakerConfig

    @IsString()
    beApiKey: string

    @IsString()
    depositApiKey: string

    @ValidateNested()
    @Type(() => FrankieOneConfig)
    frankieOneConfig: FrankieOneConfig

    @ValidateNested()
    @Type(() => FatZebraConfig)
    fatZebraConfig: FatZebraConfig

    @IsString()
    graphQLUrl: string

    @ValidateNested()
    @Type(() => BetStopConfig)
    betStopConfig: BetStopConfig

    @IsString()
    prizeUrl: string

    @IsBoolean()
    shouldIgnoreVerifyBetStop: boolean

    @IsBoolean()
    shouldIgnoreVerifyFrankieOne: boolean

    @IsNumber()
    @IsNotEmpty()
    startPrizeIndex: number

    @IsString()
    s3RootDir: string

    @IsString()
    socketKeyTest: string

    @ValidateNested()
    @Type(() => SandboxConfig)
    sandboxConfig: SandboxConfig

    @ValidateNested()
    @Type(() => PaypalConfig)
    paypalConfig: PaypalConfig

    @IsString()
    feUrl: string

    @IsString()
    appName: string

    @ValidateNested()
    @Type(() => FCMConfig)
    fcmConfig: FCMConfig

    @IsString()
    privateKeyFCM: string

    @ValidateNested()
    @Type(() => IntercomConfig)
    intercomConfig: IntercomConfig

    @ValidateNested()
    @Type(() => BetStopConfig)
    sportConfig: BetStopConfig

    @ValidateNested()
    @Type(() => BetStopConfig)
    sportPrizeConfig: BetStopConfig

    @ValidateNested()
    @Type(() => SentryConfig)
    sentryConfig: SentryConfig

    @ValidateNested()
    @Type(() => ClassicRemoteBetYourselfOddsConfig)
    classicRemoteBetYourselfOddsConfig: ClassicRemoteBetYourselfOddsConfig

    @ValidateNested()
    @Type(() => BetStopConfig)
    sportLadderConfig: BetStopConfig

    @ValidateNested()
    @Type(() => TwilioConfig)
    twilioConfig: TwilioConfig

    constructor() {
        const env = process.env
        this.nodeEnv = env.NODE_ENV
        this.port = parseInt(env.PORT)
        this.masterDb = this.decodeStringObj(env.MASTER_DB)
        this.slavesDb = this.decodeStringObj(env.SLAVES_DB)
        this.redis = this.decodeStringObj(env.REDIS)
        this.jwt = this.decodeStringObj(env.JWT)
        this.basicAuthPassword = env.BASIC_AUTH_PASSWORD
        this.awsConfig = this.decodeStringObj(env.AWS_CREDENTIALS)
        this.blockAfterLoginFails = parseInt(env.BLOCK_AFTER_LOGIN_FAIL)
        this.mailConfig = this.decodeStringObj(env.SES_CREDENTIALS)
        this.snsConfig = this.decodeStringObj(env.SNS_CREDENTIALS)
        this.maximumOtpTimes = parseInt(env.MAXIUM_OTP_TIMES)
        this.otpExpiredTime = parseInt(env.OTP_EXPIRE)
        this.freshsalesConfig = this.decodeStringObj(
            env.FRESH_SALES_CREDENTIALS
        )
        this.betMakerConfig = this.decodeStringObj(env.BET_MAKER_CREDENTIALS)
        this.beApiKey = env.BE_API_KEY
        this.depositApiKey = env.DEPOSIT_API_KEY
        this.frankieOneConfig = this.decodeStringObj(
            env.FRANKIE_ONE_CREDENTIALS
        )
        this.fatZebraConfig = this.decodeStringObj(env.FAT_ZEBRA_CREDENTIALS)
        this.graphQLUrl = env.GRAPHQL_URL
        this.betStopConfig = this.decodeStringObj(env.BET_STOP_CREDENTIALS)
        this.prizeUrl = env.PRIZE_URL
        this.shouldIgnoreVerifyBetStop =
            env.IGNORE_VERIFY_BETSTOP.toLowerCase() === 'true'
        this.startPrizeIndex = parseInt(env.START_PRIZE_INDEX)
        this.s3RootDir = env.S3_ROOT_DIR
        this.socketKeyTest = env.SOCKET_KEY_TEST
        this.sandboxConfig = this.decodeStringObj(env.SANDBOX_CREDENTIALS)
        this.paypalConfig = this.decodeStringObj(env.PAYPAL_CREDENTIALS)
        this.feUrl = env.FE_URL
        this.appName = env.APP_NAME
        this.fcmConfig = this.decodeStringObj(env.FCM)
        this.privateKeyFCM = env.PRIVATE_KEY_FCM
        this.shouldIgnoreVerifyFrankieOne =
            env.IGNORE_VERIFY_FRANKIE_ONE.toLowerCase() === 'true'
        this.intercomConfig = this.decodeStringObj(env.INTERCOM_CREDENTIALS)
        this.sportConfig = this.decodeStringObj(env.SPORT_CREDENTIALS)
        this.sportPrizeConfig = this.decodeStringObj(
            env.SPORT_PRIZE_CREDENTIALS
        )
        this.sentryConfig = this.decodeStringObj(env.SENTRY_CREDENTIALS)
        this.classicRemoteBetYourselfOddsConfig = this.decodeStringObj(
            env.BETHUB_SHOWDOWN_CREDENTIALS
        )
        this.sportLadderConfig = this.decodeStringObj(
            env.SPORT_LADDER_CREDENTIALS
        )
        this.twilioConfig = this.decodeStringObj(env.TWILIO_CREDENTIALS)
    }

    isProduction() {
        return this.nodeEnv === 'production'
    }

    isLocal() {
        return this.nodeEnv === 'local'
    }

    private decodeStringObj(str: string) {
        return JSON.parse(str.replace(/\\/g, ''))
    }
}

export const validateEnv = (config: Config) => {
    const errors = validateSync(plainToInstance(Config, config))
    if (errors.length) {
        const childErrors = errors.map((e) => e.children).flat()
        const constraints = [...errors, ...childErrors].map(
            (e) => e.constraints
        )
        throw new Error(`Env validation error: ${JSON.stringify(constraints)}`)
    }
}

export const config = Container.get(Config)
