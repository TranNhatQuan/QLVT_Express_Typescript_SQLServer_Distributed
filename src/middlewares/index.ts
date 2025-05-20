import { CompressionMiddleware } from './CompressionMiddleware'
import { BodyParserMiddleware } from './BodyParserMiddleware'
import { CustomErrorHandlerMiddleware } from './ErrorHandlerMiddleware'

export const Middlewares = [
    CompressionMiddleware,
    BodyParserMiddleware,
    CustomErrorHandlerMiddleware,
]
