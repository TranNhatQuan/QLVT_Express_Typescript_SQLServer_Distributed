import { Expose } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { SettingKeys } from "../types/setting-key.types";

export class SettingGetDetailReqDTO {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  key: SettingKeys;
}
