import { IsNumber, IsOptional, IsString } from "class-validator";

export class MySqlDataSourceConfig {
  @IsString()
  host: string;

  @IsNumber()
  port: number;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  database: string;

  @IsString()
  @IsOptional()
  secondDatabase?: string;
}
