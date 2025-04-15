import * as express from 'express'
import {
    ExpressErrorMiddlewareInterface,
    Middleware,
} from 'routing-controllers'
import { handleError } from '../utils/error'
import { parseValidationError } from '../utils/validator'
import { Service } from 'typedi'

@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
    public error(
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ): void {
        return handleError(err, res)
    }
}

@Service()
@Middleware({ type: 'after' })
export class CustomErrorHandlerMiddleware
    implements ExpressErrorMiddlewareInterface
{
    error(error: any, request: any, response: any, next: (err: any) => any) {
        if (error?.errors) {
            next(parseValidationError(error.errors))
        } else {
            next(error)
        }
    }
}
