import { BranchController } from '../modules/branch/controllers/branch.controller'
import { CustomerController } from '../modules/customer/controllers/customer.controller'
import { ExportController } from '../modules/export/controllers/export.controller'
import { HealthController } from '../modules/health/health.controller'
import { ImportController } from '../modules/import/controllers/import.controller'
import { OrderController } from '../modules/order/controllers/order.controller'
import { ProductController } from '../modules/product/controllers/product.controller'
import { UserController } from '../modules/user/controllers/user.controller'
import { WarehouseController } from '../modules/warehouse/controllers/warehouse.controller'

export const RoutingControllersV1 = [
    UserController,
    CustomerController,
    BranchController,
    ProductController,
    WarehouseController,
    HealthController,
    OrderController,
    ExportController,
    ImportController,
]
