import { BranchController } from '../modules/branch/controllers/branch.controller'
import { CustomerController } from '../modules/customer/controllers/customer.controller'
import { ProductController } from '../modules/product/controllers/product.controller'
import { UserController } from '../modules/user/controllers/user.controller'
import { WarehouseController } from '../modules/warehouse/controllers/warehouse.controller'

export const RoutingControllersV1 = [
    UserController,
    CustomerController,
    BranchController,
    ProductController,
    WarehouseController,
]
