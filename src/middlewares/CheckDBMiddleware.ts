import * as express from 'express'
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers'
import { Service } from 'typedi'
import { Errors } from '../utils/error'
import { DBType } from '../configs/types/application-constants.type'
import { UserRole } from '../modules/user/types/role.type'

@Service()
@Middleware({ type: 'before' })
export class CheckDBSelectionMiddleware implements ExpressMiddlewareInterface {
    public async use(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req['userAction'].loadOrginDBType()

        const dbType: DBType =
            req['dbType'] || req.body.dbType || req.query.dbType

        if (
            dbType &&
            dbType != DBType.USER &&
            dbType != req['userAction'].originDBType &&
            req['userAction'].role != UserRole.CompanyAdmin
        ) {
            throw Errors.Forbidden
        }

        return next()
    }
}
