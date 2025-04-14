import { Expose } from "class-transformer";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class SettingGetListReqDTO {
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  section: string;
}

export class SettingFilterDTO {
  @Expose()
  section: string;
}
