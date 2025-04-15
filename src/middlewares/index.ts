import { SecurityHstsMiddleware } from './SecurityHstsMiddleware'
import { SecurityMiddleware } from './SecurityMiddleware'
import { CompressionMiddleware } from './CompressionMiddleware'
import { BodyParserMiddleware } from './BodyParserMiddleware'
import { CustomErrorHandlerMiddleware } from './ErrorHandlerMiddleware'

export const Middlewares = [
    CompressionMiddleware,
    SecurityHstsMiddleware,
    SecurityMiddleware,
    BodyParserMiddleware,
    CustomErrorHandlerMiddleware,
]
