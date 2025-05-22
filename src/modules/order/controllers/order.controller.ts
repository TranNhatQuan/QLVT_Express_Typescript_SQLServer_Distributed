import {
    Body,
    CurrentUser,
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
import { UserDTO } from '../../user/dtos/user.dto'
import { GetOrderRequest } from '../requests/get-order.request'
import { AssignReqParamsToQueryMiddleware } from '../../../middlewares/AssignReqParamsToQueryMiddleware'
import { DBTypeMapping } from '../../../configs/types/application-constants.type'

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
        data: CreateOrderRequest,
        @CurrentUser({ required: true }) user: UserDTO
    ) {
        data.userAction = user

        const result = await this.orderService.createOrder(data)
        return new ResponseWrapper(result)
    }

    @Put('/')
    async updateOrder(
        @Body({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: CreateOrderRequest,
        @CurrentUser({ required: true }) user: UserDTO
    ) {
        data.userAction = user

        const result = await this.orderService.createOrder(data)
        return new ResponseWrapper(result)
    }

    @Delete('/:orderId/delete')
    async deleteOrder(
        @Param('orderId') orderId: string,
        @CurrentUser({ required: true }) user: UserDTO
    ) {
        await this.orderService.deleteOrder(orderId, user)
        return new ResponseWrapper(true)
    }

    @Put('/:orderId/complete')
    async completeOrder(
        @Param('orderId') orderId: string,
        @CurrentUser({ required: true }) user: UserDTO
    ) {
        await this.orderService.completeOrder(orderId, user)
        return new ResponseWrapper(true)
    }
}
