import * as express from 'express'
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers'
import { Service } from 'typedi'
import _ from 'lodash'

@Service()
@Middleware({ type: 'before' })
export class AssignReqParamsToBodyMiddleware
    implements ExpressMiddlewareInterface
{
    public async use(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        _.assign(req.body, req.params)

        return next()
    }
}
