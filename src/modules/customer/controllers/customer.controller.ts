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
import { GetListCustomerRequest } from '../requests/get-list-customer.request'
import { AssignReqParamsToBodyMiddleware } from '../../../middlewares/AssignReqParamsToBodyMiddleware'
import { UpdateCustomerRequest } from '../requests/update-customer.request'
import { VerifyAccessTokenMiddleware } from '../../../middlewares/VerifyAccessTokenMiddleware'
import { CreateCustomerRequest } from '../requests/create-customer.request'
import { CheckDBSelectionMiddleware } from '../../../middlewares/CheckDBMiddleware'
import { CustomerService } from '../services/customer.service'

@Service()
@JsonController('/v1/customers')
@UseBefore(VerifyAccessTokenMiddleware)
@UseBefore(CheckDBSelectionMiddleware)
export class CustomerController {
    constructor(@Inject() public customerService: CustomerService) {}

    @Get('/')
    async getListCustomer(
        @QueryParams({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: GetListCustomerRequest
    ) {
        const result = await this.customerService.getCustomers(data)
        return new ResponseWrapper(result, null, data.pagination)
    }

    @Put('/:customerId/update')
    @UseBefore(AssignReqParamsToBodyMiddleware)
    async updateCustomer(
        @Body({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: UpdateCustomerRequest
    ) {
        const result = await this.customerService.updateCustomer(data)
        return new ResponseWrapper(result)
    }

    @Post('/')
    async createCustomer(
        @Body({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: CreateCustomerRequest
    ) {
        const result = await this.customerService.createCustomer(data)
        return new ResponseWrapper(result)
    }

    @Delete('/:customerId/delete')
    async deleteCustomer(@Param('customerId') customerId: string) {
        await this.customerService.deleteCustomer(Number(customerId))
        return new ResponseWrapper(true)
    }
}
