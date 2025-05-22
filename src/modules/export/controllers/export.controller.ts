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
import { CreateExportRequest } from '../requests/create-export.request'
import { CheckDBSelectionMiddleware } from '../../../middlewares/CheckDBMiddleware'
import { ExportService } from '../services/export.service'
import { GetListExportRequest } from '../requests/get-list-export.request'

@Service()
@JsonController('/v1/exports')
@UseBefore(CheckDBSelectionMiddleware)
@UseBefore(VerifyAccessTokenMiddleware)
export class ExportController {
    constructor(@Inject() public exportService: ExportService) {}

    @Get('/')
    async getListBranch(
        @QueryParams({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: GetListExportRequest
    ) {
        const result = await this.exportService.getBranchs(data)
        return new ResponseWrapper(result, null, data.pagination)
    }

    @Post('/')
    async createBranch(
        @Body({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: CreateExportRequest
    ) {
        const result = await this.exportService.createBranch(data)
        return new ResponseWrapper(result)
    }
}
