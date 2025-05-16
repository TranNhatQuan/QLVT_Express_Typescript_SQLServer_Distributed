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

@Service()
@JsonController('/v1/orders')
@UseBefore(VerifyAccessTokenMiddleware)
@UseBefore(CheckDBSelectionMiddleware)
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

    @Delete('/:orderId/delete')
    async deleteBranch(
        @Param('orderId') orderId: string,
        @CurrentUser({ required: true }) user: UserDTO
    ) {
        await this.orderService.deleteOrder(orderId, user)
        return new ResponseWrapper(true)
    }

    @Put('/:orderId/cancel')
    async cancelOrder(
        @Param('orderId') orderId: string,
        @CurrentUser({ required: true }) user: UserDTO
    ) {
        await this.orderService.cancelOrder(orderId, user)
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
