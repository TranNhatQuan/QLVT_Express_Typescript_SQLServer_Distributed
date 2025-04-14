import { Router } from 'express'
import { Inject, Service } from 'typedi'
import { AppRoute } from '../../app'
import { transformAndValidate } from '../../utils/validator'
import { AddressController } from './address.controller'

@Service()
export class AddressRoute implements AppRoute {
    route?: string = 'address'
    router: Router = Router()

    constructor(@Inject() private addressController: AddressController) {
        this.initRoutes()
    }

    private initRoutes() {
        this.router.get(
            '/states',
            this.addressController.getStates.bind(this.addressController)
        )
    }
}
