import {
    Body,
    Delete,
    Get,
    JsonController,
    Param,
    Post,
    Put,
    QueryParams,
    UseBefore,
} from 'routing-controllers'
import { Inject, Service } from 'typedi'
import { ResponseWrapper } from '../../../utils/response'
import { AssignReqParamsToBodyMiddleware } from '../../../middlewares/AssignReqParamsToBodyMiddleware'
import { VerifyAccessTokenMiddleware } from '../../../middlewares/VerifyAccessTokenMiddleware'
import { CheckDBSelectionMiddleware } from '../../../middlewares/CheckDBMiddleware'
import { WarehouseService } from '../services/warehouse.service'
import { GetListWarehouseRequest } from '../requests/get-list-warehouse.request'
import { UpdateWarehouseRequest } from '../requests/update-warehouse.request'
import { CreateWarehouseRequest } from '../requests/create-warehouse.request'

@Service()
@JsonController('/v1/warehouses')
@UseBefore(CheckDBSelectionMiddleware)
@UseBefore(VerifyAccessTokenMiddleware)
export class WarehouseController {
    constructor(@Inject() public warehouseService: WarehouseService) {}

    @Get('/')
    async getListWarehouse(
        @QueryParams({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: GetListWarehouseRequest
    ) {
        const result = await this.warehouseService.getWarehouses(data)
        return new ResponseWrapper(result, null, data.pagination)
    }

    @Put('/:warehouseId')
    @UseBefore(AssignReqParamsToBodyMiddleware)
    async updateWarehouse(
        @Body({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: UpdateWarehouseRequest
    ) {
        const result = await this.warehouseService.updateWarehouse(data)
        return new ResponseWrapper(result)
    }

    @Post('/')
    async createWarehouse(
        @Body({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: CreateWarehouseRequest
    ) {
        const result = await this.warehouseService.createWarehouse(data)
        return new ResponseWrapper(result)
    }

    @Delete('/:warehouseId')
    @UseBefore(AssignReqParamsToBodyMiddleware)
    async deleteBranch(@Param('warehouseId') warehouseId: number) {
        await this.warehouseService.deleteWarehouse(warehouseId)
        return new ResponseWrapper(true)
    }
}
