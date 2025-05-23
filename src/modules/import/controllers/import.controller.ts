import {
    Body,
    Get,
    JsonController,
    Post,
    QueryParams,
    UseBefore,
} from 'routing-controllers'
import { Inject, Service } from 'typedi'
import { ResponseWrapper } from '../../../utils/response'

import { VerifyAccessTokenMiddleware } from '../../../middlewares/VerifyAccessTokenMiddleware'
import { CreateImportRequest } from '../requests/create-import.request'
import { CheckDBSelectionMiddleware } from '../../../middlewares/CheckDBMiddleware'
import { ImportService } from '../services/import.service'
import { GetListImportRequest } from '../requests/get-list-import.request'

@Service()
@JsonController('/v1/imports')
@UseBefore(CheckDBSelectionMiddleware)
@UseBefore(VerifyAccessTokenMiddleware)
export class ImportController {
    constructor(@Inject() public importService: ImportService) {}

    @Get('/')
    async getImports(
        @QueryParams({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: GetListImportRequest
    ) {
        const result = await this.importService.getImports(data)
        return new ResponseWrapper(result, null, data.pagination)
    }

    @Post('/')
    async createImport(
        @Body({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: CreateImportRequest
    ) {
        const result = await this.importService.createImport(data)
        return new ResponseWrapper(result)
    }
}
