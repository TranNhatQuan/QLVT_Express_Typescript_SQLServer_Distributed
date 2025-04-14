import { Service } from "typedi";
import { SettingKeys } from "../types/setting-key.types";
import { SettingRepos } from "../repos/setting.repos";
import { SettingUpdateRequestDTO } from "../dtos/setting-update-req.dto";
import { SettingGetListReqDTO } from "../dtos/setting-get-list-req.dto";

@Service()
export class SettingService {
  async getJoinLimit() {
    const setting = await SettingRepos.getSettingByKey(SettingKeys.JoinLimit);

    return parseInt(setting.value);
  }

  async getSettingByKey(key: SettingKeys) {
    return await SettingRepos.getSettingByKey(key);
  }

  async getSettings(data: SettingGetListReqDTO) {
    return SettingRepos.getSettings(data);
  }

  async updateSetting(data: SettingUpdateRequestDTO) {
    await SettingRepos.updateSetting(data);
  }
}
