import { plainToInstance, Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  validateSync,
} from "class-validator";
import Container, { Service } from "typedi";
import { MSSqlDataSourceConfig } from "./db.config";
import { JwtConfig } from "./jwt.config";
import { RedisConfig } from "./redis.config";

@Service()
export class Config {
  @IsString()
  @IsNotEmpty()
  nodeEnv: string;

  @IsNumber()
  @IsNotEmpty()
  port: number;

  @ValidateNested()
  @Type(() => MSSqlDataSourceConfig)
  masterDb: MSSqlDataSourceConfig;

  @ValidateNested()
  @Type(() => MSSqlDataSourceConfig)
  shardHCM: MSSqlDataSourceConfig;

  @ValidateNested()
  @Type(() => MSSqlDataSourceConfig)
  shardHN: MSSqlDataSourceConfig;

  @ValidateNested()
  @Type(() => MSSqlDataSourceConfig)
  shardUser: MSSqlDataSourceConfig;

  @ValidateNested()
  @Type(() => RedisConfig)
  redis: RedisConfig;

  @ValidateNested()
  @Type(() => JwtConfig)
  jwt: JwtConfig;

  @IsString()
  basicAuthPassword: string;

  @IsNumber()
  @IsNotEmpty()
  blockAfterLoginFails: number;

  @IsNumber()
  @IsNotEmpty()
  maximumOtpTimes: number;

  @IsNumber()
  @IsNotEmpty()
  otpExpiredTime: number;

  @IsString()
  beApiKey: string;

  @IsString()
  feUrl: string;

  @IsString()
  appName: string;

  constructor() {
    const env = process.env;
    this.nodeEnv = env.NODE_ENV;
    this.port = parseInt(env.PORT);
    this.masterDb = this.decodeStringObj(env.MASTER_DB);
    this.shardHN = this.decodeStringObj(env.SHARD_HN);
    this.shardHCM = this.decodeStringObj(env.SHARD_HCM);
    this.shardUser = this.decodeStringObj(env.SHARD_USER);
    this.redis = this.decodeStringObj(env.REDIS);
    this.jwt = this.decodeStringObj(env.JWT);
    this.basicAuthPassword = env.BASIC_AUTH_PASSWORD;
    this.blockAfterLoginFails = parseInt(env.BLOCK_AFTER_LOGIN_FAIL);
    this.maximumOtpTimes = parseInt(env.MAXIUM_OTP_TIMES);
    this.otpExpiredTime = parseInt(env.OTP_EXPIRE);
    this.beApiKey = env.BE_API_KEY;
    this.feUrl = env.FE_URL;
    this.appName = env.APP_NAME;
  }

  isProduction() {
    return this.nodeEnv === "production";
  }

  isLocal() {
    return this.nodeEnv === "local";
  }

  private decodeStringObj(str: string) {
    return JSON.parse(str.replace(/\\/g, ""));
  }
}

export const validateEnv = (config: Config) => {
  const errors = validateSync(plainToInstance(Config, config));
  if (errors.length) {
    const childErrors = errors.map((e) => e.children).flat();
    const constraints = [...errors, ...childErrors].map((e) => e.constraints);
    throw new Error(`Env validation error: ${JSON.stringify(constraints)}`);
  }
};

export const config = Container.get(Config);
