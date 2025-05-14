import {
    Body,
    Delete,
    Get,
    JsonController,
    Post,
    Put,
    QueryParams,
    UseBefore,
} from 'routing-controllers'
import { Inject, Service } from 'typedi'
import { ResponseWrapper } from '../../../utils/response'
import { GetListBranchRequest } from '../requests/get-list-branch.request'
import { AssignReqParamsToBodyMiddleware } from '../../../middlewares/AssignReqParamsToBodyMiddleware'
import { UpdateBranchRequest } from '../requests/update-branch.request'
import { VerifyAccessTokenMiddleware } from '../../../middlewares/VerifyAccessTokenMiddleware'
import { CreateBranchRequest } from '../requests/create-branch.request'
import { DeleteBranchRequest } from '../requests/delete-branch.request'
import { CheckDBSelectionMiddleware } from '../../../middlewares/CheckDBMiddleware'
import { BranchService } from '../services/export.service'

@Service()
@JsonController('/v1/branchs')
@UseBefore(VerifyAccessTokenMiddleware)
@UseBefore(CheckDBSelectionMiddleware)
export class BranchController {
    constructor(@Inject() public branchService: BranchService) {}

    @Get('/')
    async getListBranch(
        @QueryParams({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: GetListBranchRequest
    ) {
        const result = await this.branchService.getBranchs(data)
        return new ResponseWrapper(result, null, data.pagination)
    }

    @Put('/:branchId/update')
    @UseBefore(AssignReqParamsToBodyMiddleware)
    async updateBranch(
        @Body({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: UpdateBranchRequest
    ) {
        const result = await this.branchService.updateBranch(data)
        return new ResponseWrapper(result)
    }

    @Post('/')
    async createBranch(
        @Body({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: CreateBranchRequest
    ) {
        const result = await this.branchService.createBranch(data)
        return new ResponseWrapper(result)
    }

    @Delete('/:branchId/delete')
    @UseBefore(AssignReqParamsToBodyMiddleware)
    async deleteBranch(
        @Body({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: DeleteBranchRequest
    ) {
        await this.branchService.deleteBranch(data)
        return new ResponseWrapper(true)
    }
}
