import { Action, HttpError } from "routing-controllers";
import { getAuthHeader } from "../modules/auth/auth.middleware";
import { logger } from "../utils/logger";
import jwt from "jsonwebtoken";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { AuthPayload } from "../modules/auth/auth.service";

export function currentUserChecker(): (
  action: Action
) => Promise<{ userId: string }> {
  return async function innerCurrentUserChecker(action: Action): Promise<any> {
    try {
      const token = getAuthHeader(action.request);

      const decoded = jwt.decode(token, {
        complete: true,
      });

      if (!decoded) {
        return null;
      }

      const plainPayload = instanceToPlain(decoded.payload);
      const authPayload = plainToInstance(AuthPayload, plainPayload);
      //   const user = await UserRepos.getProfile(authPayload.userId);
      //   UserRepos.checkStatus(user);

      //return user;
      return { userId: authPayload.userId };
    } catch (error: any) {
      logger.error(error.stack);

      throw new HttpError(401, "Invalid token");
    }
  };
}
