import { NextFunction, Response } from 'express'
import { Inject, Service } from 'typedi'
import { DataRequest } from '../../base/base.request'
import { ResponseWrapper } from '../../utils/response'
import { AddressService } from './address.service'

@Service()
export class AddressController {
    constructor(@Inject() public addressService: AddressService) {}

    async getStates(
        req: DataRequest<never>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await this.addressService.getStates()
            res.send(new ResponseWrapper(user))
        } catch (error) {
            next(error)
        }
    }
}
