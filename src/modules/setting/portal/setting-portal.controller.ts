// import { Inject, Service } from "typedi";
// import { DataRequest } from "../../../base/base.request";
// import { NextFunction, Response } from "express";
// import { ResponseWrapper } from "../../../utils/response";
// import { SettingGetDetailReqDTO } from "../dtos/setting-get-detail-req.dto";
// import { SettingService } from "../services/setting.service";
// import { SettingUpdateRequestDTO } from "../dtos/setting-update-req.dto";
// import { SettingGetListReqDTO } from "../dtos/setting-get-list-req.dto";

// @Service()
// export class SettingPortalController {
//   constructor(@Inject() public settingService: SettingService) {}

//   async getSetting(
//     req: DataRequest<SettingGetDetailReqDTO>,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { data } = req;
//       const setting = await this.settingService.getSettingByKey(data.key);

//       res.send(new ResponseWrapper(setting));
//     } catch (err) {
//       next(err);
//     }
//   }

//   async updateSetting(
//     req: DataRequest<SettingUpdateRequestDTO>,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { data, userId } = req;
//       data.updatedBy = userId;
//       await this.settingService.updateSetting(data);

//       res.send(new ResponseWrapper(true));
//     } catch (err) {
//       next(err);
//     }
//   }

//   async getSettings(
//     req: DataRequest<SettingGetListReqDTO>,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { data } = req;
//       const settings = await this.settingService.getSettings(data);

//       res.send(new ResponseWrapper(settings));
//     } catch (err) {
//       next(err);
//     }
//   }
// }
