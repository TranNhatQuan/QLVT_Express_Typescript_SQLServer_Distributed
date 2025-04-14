import { Expose, plainToInstance, Type } from "class-transformer";
import { SettingKeys } from "./setting-key.types";

import _ from "lodash";
import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

const parseToNumber = (value) => Number(value);
const parseToBoolean = (value) =>
  value === 1 || value === "1" || value === "true" || value === true;
const transformJsonToClass =
  <T>(cls?: new () => T) =>
  (value: string) => {
    if (!cls) {
      return JSON.parse(value);
    }

    return plainToInstance(cls, JSON.parse(value), {
      excludeExtraneousValues: true,
    });
  };

export class TextInfo {
  @Expose()
  value: string;

  @Expose()
  fontSize: number;

  @Expose()
  hexColour: string;
}

export class ImageInfo {
  @Expose()
  url: string;

  @Expose()
  size: number;
}

export class SettingFlashBannerForFreeQuickPick {
  @Expose()
  @Type(() => ImageInfo)
  png: ImageInfo;

  @Expose()
  @Type(() => TextInfo)
  title: TextInfo;

  @Expose()
  @Type(() => TextInfo)
  topText: TextInfo;

  @Expose()
  @Type(() => TextInfo)
  middleText: TextInfo;

  @Expose()
  @Type(() => TextInfo)
  bottomText: TextInfo;
}

export class PushNotificationData {
  @Expose()
  event?: string;

  @Expose()
  title?: string;
  @Expose()
  message?: string;

  @Expose()
  deepLink?: string;

  @Expose()
  webLink?: string;

  generateContent(data: any) {
    let temp = JSON.stringify(this);
    Object.keys(data).forEach((key) => {
      const value = data[key];
      temp = temp.replaceAll(`\${${key}}`, value as string);
    });
    _.assign(this, JSON.parse(temp));
  }
}

export class ConfigBetYourselfBetslip {
  @Expose()
  @IsBoolean()
  isDisablePlaceBet: boolean;

  @Expose()
  limitEstReturns: Record<number, number>;

  @Expose()
  @IsBoolean()
  isAutoAccept: boolean;

  @Expose()
  @IsBoolean()
  isAutoPartial: boolean;
}

export class MarketMargin {
  @Expose()
  @IsNotEmpty()
  Type: string;

  @Expose()
  @IsNotEmpty()
  Id: string;
}

export class ConfigCompUpcomingSendNoti {
  @Expose()
  @IsNumber()
  threshold: number;

  @Expose()
  dataNoti: PushNotificationData;
}

export class ConfigCompUpcomingSendNotiMap {
  @Expose()
  configs: Record<string, ConfigCompUpcomingSendNoti>;
}

export const SettingMappingValueTypes = {
  [SettingKeys.JoinLimit]: parseToNumber,
  [SettingKeys.Stake]: parseToNumber,
};
