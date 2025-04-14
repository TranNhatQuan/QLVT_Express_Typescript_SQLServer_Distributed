// import { Inject, Service } from "typedi";
// import { AppRoute } from "../../../app";
// import { Router } from "express";
// import { SettingPortalController } from "./setting-portal.controller";
// import { AuthMiddleware } from "../../auth/auth.middleware";
// import { transformAndValidate } from "../../../utils/validator";
// import { RoleMiddleware } from "../../roles/role.middleware";
// import { SettingGetDetailReqDTO } from "../dtos/setting-get-detail-req.dto";
// import { SettingUpdateRequestDTO } from "../dtos/setting-update-req.dto";
// import { SettingGetListReqDTO } from "../dtos/setting-get-list-req.dto";

// @Service()
// export class SettingPortalRoute implements AppRoute {
//   route?: string = "settings";
//   router: Router = Router();

//   constructor(
//     @Inject() private settingPortalController: SettingPortalController,
//     @Inject() private authMiddleware: AuthMiddleware,
//     @Inject() private roleMiddleware: RoleMiddleware
//   ) {
//     this.initRoutes();
//   }

//   private initRoutes() {
//     // Get list settings
//     this.router.get(
//       "/",
//       transformAndValidate(SettingGetListReqDTO),
//       this.settingPortalController.getSettings.bind(
//         this.settingPortalController
//       )
//     );

//     // Get setting
//     this.router.get(
//       "/:key",
//       transformAndValidate(SettingGetDetailReqDTO),
//       this.settingPortalController.getSetting.bind(this.settingPortalController)
//     );

//     // Update setting
//     this.router.put(
//       "/:key",
//       this.authMiddleware.authorize.bind(this.authMiddleware),
//       this.roleMiddleware.hasFullAccess.bind(this.roleMiddleware),
//       transformAndValidate(SettingUpdateRequestDTO),
//       this.settingPortalController.updateSetting.bind(
//         this.settingPortalController
//       )
//     );
//   }
// }
