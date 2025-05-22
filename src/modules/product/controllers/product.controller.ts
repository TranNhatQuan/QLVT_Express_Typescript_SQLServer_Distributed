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
import { ProductService } from '../services/product.service'
import { GetListProductRequest } from '../requests/get-list-product.request'
import { UpdateProductRequest } from '../requests/update-product.request'
import { CreateProductRequest } from '../requests/create-product.request'
import { BaseReq } from '../../../base/base.request'
import { UserRole } from '../../user/types/role.type'
import { Errors } from '../../../utils/error'

@Service()
@JsonController('/v1/products')
@UseBefore(CheckDBSelectionMiddleware)
@UseBefore(VerifyAccessTokenMiddleware)
export class ProductController {
    constructor(@Inject() public productService: ProductService) {}

    @Get('/')
    async getListProduct(
        @QueryParams({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: GetListProductRequest
    ) {
        const result = await this.productService.getProducts(data)
        return new ResponseWrapper(result, null, data.pagination)
    }

    @Put('/:productId')
    @UseBefore(AssignReqParamsToBodyMiddleware)
    async updateProduct(
        @Body({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: UpdateProductRequest
    ) {
        const result = await this.productService.updateProduct(data)
        return new ResponseWrapper(result)
    }

    @Post('/')
    async createProduct(
        @Body({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: CreateProductRequest
    ) {
        const result = await this.productService.createProduct(data)
        return new ResponseWrapper(result)
    }

    @Delete('/:productId')
    @UseBefore(AssignReqParamsToBodyMiddleware)
    async deleteProduct(
        @Param('productId') productId: number,
        @Body() data: BaseReq
    ) {
        if (data.userAction.role !== UserRole.CompanyAdmin) {
            throw Errors.Forbidden
        }

        await this.productService.deleteBranch(productId)
        return new ResponseWrapper(true)
    }
}
