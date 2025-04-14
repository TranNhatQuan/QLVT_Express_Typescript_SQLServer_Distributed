// import * as express from "express";
// import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
// import Container, { Service } from "typedi";
// import { getAuthHeader } from "../modules/auth/auth.middleware";
// import { AuthService } from "../modules/auth/auth.service";
// import { UserService } from "../modules/users/user.service";
// import { Errors } from "../utils/error";

// @Service()
// @Middleware({ type: "before" })
// export class CheckAdminRoleMiddleware implements ExpressMiddlewareInterface {
//   public async use(
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
//   ) {
//     const token = getAuthHeader(req);
//     const payload = Container.get(AuthService).getPayloadFromJwt(token);
//     const userDTO = await Container.get(UserService).getProfile(payload.userId);

//     if (!userDTO.isSuperAdmin) {
//       throw Errors.Forbidden;
//     }

//     return next();
//   }
// }
