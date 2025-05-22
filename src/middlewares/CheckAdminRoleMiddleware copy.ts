import * as express from 'express'
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers'
import { Service } from 'typedi'
import { Errors } from '../utils/error'
import { UserRole } from '../modules/user/types/role.type'

@Service()
@Middleware({ type: 'before' })
export class CheckAdminRoleMiddleware implements ExpressMiddlewareInterface {
    public async use(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req['userAction'].role !== UserRole.CompanyAdmin) {
            throw Errors.Forbidden
        }

        return next()
    }
}
