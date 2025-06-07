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
import { VerifyAccessTokenMiddleware } from '../../../middlewares/VerifyAccessTokenMiddleware'
import { CheckDBSelectionMiddleware } from '../../../middlewares/CheckDBMiddleware'
import { OrderService } from '../services/order.service'
import { GetListOrderRequest } from '../requests/get-list-order.request'
import { CreateOrderRequest } from '../requests/create-order.request'
import { GetOrderRequest } from '../requests/get-order.request'
import { AssignReqParamsToQueryMiddleware } from '../../../middlewares/AssignReqParamsToQueryMiddleware'
import { DBTypeMapping } from '../../../configs/types/application-constants.type'
import { BaseReq } from '../../../base/base.request'
import { UpdateOrderRequest } from '../requests/update-order.request'
import { AssignReqParamsToBodyMiddleware } from '../../../middlewares/AssignReqParamsToBodyMiddleware'
import { ChangeOrderDetailRequest } from '../requests/change-order-detail.request'

@Service()
@JsonController('/v1/orders')
@UseBefore(CheckDBSelectionMiddleware)
@UseBefore(VerifyAccessTokenMiddleware)
export class OrderController {
    constructor(@Inject() public orderService: OrderService) {}

    @Get('/')
    async GetListOrder(
        @QueryParams({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: GetListOrderRequest
    ) {
        const result = await this.orderService.getOrders(data)
        return new ResponseWrapper(result, null, data.pagination)
    }

    @Get('/:orderId')
    @UseBefore(AssignReqParamsToQueryMiddleware)
    async getOrderById(@QueryParams() data: GetOrderRequest) {
        const manager = DBTypeMapping[data.dbType].manager

        const result = await this.orderService.getOrderDetail(
            data.orderId,
            manager
        )
        return new ResponseWrapper(result)
    }

    @Post('/')
    async createOrder(
        @Body({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: CreateOrderRequest
    ) {
        const result = await this.orderService.createOrder(data)
        return new ResponseWrapper(result)
    }

    @Put('/:orderId')
    @UseBefore(AssignReqParamsToBodyMiddleware)
    async updateOrder(
        @Body({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: UpdateOrderRequest
    ) {
        const result = await this.orderService.updateOrder(data)
        return new ResponseWrapper(result)
    }

    @Post('/:orderId/details')
    @UseBefore(AssignReqParamsToBodyMiddleware)
    async changeOrderDetail(
        @Body({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: ChangeOrderDetailRequest
    ) {
        const result = await this.orderService.changeOrderDetail(data)
        return new ResponseWrapper(result)
    }

    @Delete('/:orderId')
    async deleteOrder(
        @Param('orderId') orderId: string,
        @QueryParams() data: BaseReq
    ) {
        await this.orderService.deleteOrder(orderId, data.userAction)
        return new ResponseWrapper(true)
    }

    @Put('/:orderId/complete')
    async completeOrder(
        @Param('orderId') orderId: string,
        @QueryParams() data: BaseReq
    ) {
        await this.orderService.completeOrder(orderId, data.userAction)
        return new ResponseWrapper(true)
    }

    @Put('/:orderId/in-progress')
    async changeStatusToInProgress(
        @Param('orderId') orderId: string,
        @QueryParams() data: BaseReq
    ) {
        await this.orderService.changeStatusToInProgress(
            orderId,
            data.userAction
        )
        return new ResponseWrapper(true)
    }
}
