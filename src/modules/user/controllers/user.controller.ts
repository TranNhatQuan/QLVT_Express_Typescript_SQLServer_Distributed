import {
    Body,
    CurrentUser,
    Get,
    JsonController,
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
import { UserDTO } from '../dtos/user.dto'
import { VerifyAccessTokenMiddleware } from '../../../middlewares/VerifyAccessTokenMiddleware'

@Service()
@JsonController('/v1/users')
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
    @UseBefore(VerifyAccessTokenMiddleware)
    async updateUser(
        @Body({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: UpdateUserRequest,
        @CurrentUser({ required: true }) user: UserDTO
    ) {
        data.userAction = user

        const result = await this.userService.updateUser(data)
        return new ResponseWrapper(result, null, data.pagination)
    }
}
