import * as express from 'express'
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers'
import { Service } from 'typedi'
import { Errors } from '../utils/error'
import { UserDTO } from '../modules/user/dtos/user.dto'
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
        const userDTO: UserDTO = req['userAction']
        userDTO.loadOrginDBType()
        const dbType: DBType = req['dbType']

        if (
            dbType != DBType.USER &&
            dbType != userDTO.originDBType &&
            userDTO.role != UserRole.CompanyAdmin
        ) {
            throw Errors.Forbidden
        }

        return next()
    }
}
