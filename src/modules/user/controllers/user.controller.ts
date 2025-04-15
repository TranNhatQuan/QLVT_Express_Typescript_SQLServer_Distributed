import { Get, JsonController, QueryParams } from 'routing-controllers'
import { Inject, Service } from 'typedi'
import { ResponseWrapper } from '../../../utils/response'
import { UserService } from '../services/user.service'
import { GetListUserRequest } from '../requests/get-list-user.request'

@Service()
@JsonController('/v1/users')
export class UserController {
    constructor(@Inject() public userService: UserService) {}

    @Get('/users')
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
}
