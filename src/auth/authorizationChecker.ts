import { Action } from "routing-controllers";
import { getAuthHeader } from "../modules/auth/auth.middleware";
import Container from "typedi";
import { AuthService } from "../modules/auth/auth.service";
import { Errors } from "../utils/error";

export function authorizationChecker(): (
  action: Action,
  roles: any[]
) => Promise<boolean> | boolean {
  return async function innerAuthorizationChecker(
    action: Action,
    roles: string[]
  ): Promise<boolean> {
    const token = getAuthHeader(action.request);

    if (!token) {
      throw Errors.Unauthorized;
    }

    await Container.get(AuthService).verifyToken(token);

    return true;
  };
}
