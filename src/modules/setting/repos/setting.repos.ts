import { AppDataSource } from "../../../database/connection";
import { Setting } from "../entities/setting.entity";
import { SettingDTO } from "../dtos/setting.dto";
import { Errors } from "../../../utils/error";
import { plainToInstance } from "class-transformer";
import {
  SettingUpdateDTO,
  SettingUpdateRequestDTO,
} from "../dtos/setting-update-req.dto";
import {
  SettingFilterDTO,
  SettingGetListReqDTO,
} from "../dtos/setting-get-list-req.dto";
import { removeUndefinedFields } from "../../../utils";

export const SettingRepos = AppDataSource.getRepository(Setting).extend({
  checkStatus(setting: Setting | SettingDTO) {
    if (!setting) {
      throw Errors.SettingNotFound;
    }
  },

  async getSettingByKey(settingKey: string, shouldValidateExist = true) {
    const setting = await this.findOneBy({
      key: settingKey,
    });

    if (shouldValidateExist) {
      this.checkStatus(setting);
    }
    return plainToInstance(SettingDTO, setting, {
      excludeExtraneousValues: true,
    });
  },

  async getSettings(data: SettingGetListReqDTO) {
    let filterDTO: any = plainToInstance(SettingFilterDTO, data, {
      excludeExtraneousValues: true,
    });
    filterDTO = removeUndefinedFields(filterDTO);

    const settings = await this.findBy(filterDTO);
    return plainToInstance(SettingDTO, settings, {
      excludeExtraneousValues: true,
    });
  },

  async validateUpdateRule(data: SettingUpdateRequestDTO) {
    await this.getSettingByKey(data.key);
  },

  async updateSetting(data: SettingUpdateRequestDTO) {
    await this.validateUpdateRule(data);
    const dataForUpdate = plainToInstance(SettingUpdateDTO, data, {
      excludeExtraneousValues: true,
    });
    await this.update({ key: data.key }, dataForUpdate);
  },
});
