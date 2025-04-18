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
import { UserService } from '../services/user.service'
import { GetListUserRequest } from '../requests/get-list-user.request'
import { AssignReqParamsToBodyMiddleware } from '../../../middlewares/AssignReqParamsToBodyMiddleware'
import { UpdateUserRequest } from '../requests/update-user.request'
import { VerifyAccessTokenMiddleware } from '../../../middlewares/VerifyAccessTokenMiddleware'
import { CreateUserRequest } from '../requests/create-user.request'
import { DeleteUserRequest } from '../requests/delete-user.request'
import { CheckDBSelectionMiddleware } from '../../../middlewares/CheckDBMiddleware'

@Service()
@JsonController('/v1/users')
@UseBefore(VerifyAccessTokenMiddleware)
@UseBefore(CheckDBSelectionMiddleware)
export class UserController {
    constructor(@Inject() public userService: UserService) {}

    @Get('/')
    async getListUser(
        @QueryParams({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: GetListUserRequest
    ) {
        const result = await this.userService.getListUser(data)
        return new ResponseWrapper(result, null, data.pagination)
    }

    @Put('/:userId/update')
    @UseBefore(AssignReqParamsToBodyMiddleware)
    async updateUser(
        @Body({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: UpdateUserRequest
    ) {
        const result = await this.userService.updateUser(data)
        return new ResponseWrapper(result, null, data.pagination)
    }

    @Post('/')
    async createUser(
        @Body({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: CreateUserRequest
    ) {
        const result = await this.userService.createUser(data)
        return new ResponseWrapper(result, null, data.pagination)
    }

    @Delete('/:userId/delete')
    @UseBefore(AssignReqParamsToBodyMiddleware)
    async deleteUser(
        @Body({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: DeleteUserRequest
    ) {
        await this.userService.deleteUser(data)
        return new ResponseWrapper(true, null, data.pagination)
    }
}
