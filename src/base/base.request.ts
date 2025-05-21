import { AuthRequest } from '../modules/auth/auth.middleware'
import { UserDTO } from '../modules/user/dtos/user.dto'

export interface DataRequest<T> extends AuthRequest {
    data: T
}

export class BaseReq {
    userAction?: UserDTO
}
