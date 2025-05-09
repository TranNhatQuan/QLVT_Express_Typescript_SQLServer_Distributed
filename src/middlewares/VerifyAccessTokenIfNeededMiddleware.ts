// import * as express from "express";
// import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
// import { Inject, Service } from "typedi";
// import { getAuthHeader } from "../modules/auth/auth.middleware";
// import { AuthService } from "../modules/auth/auth.service";
// import _ from "lodash";

// @Service()
// @Middleware({ type: "before" })
// export class VerifyAccessTokenIfNeededMiddleware
//   implements ExpressMiddlewareInterface
// {
//   constructor(@Inject() protected authService: AuthService) {}

//   public async use(
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
//   ) {
//     const token = getAuthHeader(req);

//     if (token) {
//       const payload = await this.authService.verifyToken(token);
//       _.assign(req, {
//         userId: payload.userId,
//         roleId: payload.roleId,
//         accessToken: token,
//         username: payload.username,
//       });
//     }

//     return next();
//   }
// }
