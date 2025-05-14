import { BranchController } from '../modules/branch/controllers/branch.controller'
import { CustomerController } from '../modules/customer/controllers/customer.controller'
import { UserController } from '../modules/user/controllers/user.controller'

export const RoutingControllersV1 = [
    UserController,
    CustomerController,
    BranchController,
]
