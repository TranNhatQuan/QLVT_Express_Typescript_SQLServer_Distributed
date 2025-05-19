import { Service } from 'typedi'
import { ResponseWrapper } from '../../utils/response'
import { Get, JsonController } from 'routing-controllers'

@Service()
@JsonController('/v1/healthcheck')
export class HealthController {
    constructor() {
        //
    }

    @Get('/')
    async healthCheck() {
        return new ResponseWrapper('Server is running')
    }
}
