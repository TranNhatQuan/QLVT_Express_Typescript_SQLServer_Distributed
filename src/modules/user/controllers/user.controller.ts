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
import { SignInRequest } from '../requests/sign-in.request'
import { BaseReq } from '../../../base/base.request'

@Service()
@JsonController('/v1/users')
export class UserController {
    constructor(@Inject() public userService: UserService) {}

    @Get('/')
    @UseBefore(CheckDBSelectionMiddleware)
    @UseBefore(VerifyAccessTokenMiddleware)
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
    @UseBefore(CheckDBSelectionMiddleware)
    @UseBefore(VerifyAccessTokenMiddleware)
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

    @Put('/:userId/reset-password')
    @UseBefore(CheckDBSelectionMiddleware)
    @UseBefore(VerifyAccessTokenMiddleware)
    @UseBefore(AssignReqParamsToBodyMiddleware)
    async resetPassword(
        @Body({
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: DeleteUserRequest
    ) {
        await this.userService.resetPassword(data)
        return new ResponseWrapper(true)
    }

    @Post('/')
    @UseBefore(CheckDBSelectionMiddleware)
    @UseBefore(VerifyAccessTokenMiddleware)
    async createUser(
        @Body({
            required: true,
        })
        data: CreateUserRequest
    ) {
        const result = await this.userService.createUser(data)
        return new ResponseWrapper(result, null, data.pagination)
    }

    @Post('/sign-in')
    async signIn(
        @Body({
            required: true,
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: SignInRequest
    ) {
        const result = await this.userService.signIn(data)
        return new ResponseWrapper(result)
    }

    @Delete('/sign-out')
    @UseBefore(VerifyAccessTokenMiddleware)
    async signOut(
        @Body({
            transform: {
                excludeExtraneousValues: true,
            },
        })
        data: BaseReq
    ) {
        await this.userService.signOut(data.userAction.userId)
        return new ResponseWrapper(true)
    }

    @Delete('/:userId/delete')
    @UseBefore(CheckDBSelectionMiddleware)
    @UseBefore(VerifyAccessTokenMiddleware)
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
