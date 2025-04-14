import { IsNumber, IsString } from "class-validator";
import { Expose } from "class-transformer";

export class MailConfig {
  @Expose()
  @IsString()
  endpoint: string;

  @Expose()
  @IsNumber()
  port: number;

  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsString()
  password: string;

  @Expose()
  @IsString()
  sender: string;
}
