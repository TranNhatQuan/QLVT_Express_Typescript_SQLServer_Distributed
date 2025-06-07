import { Service } from 'typedi'
import { Errors } from '../../../utils/error'
import {
    CustomerFilter,
    GetListCustomerRequest,
} from '../requests/get-list-customer.request'
import { removeUndefinedFields } from '../../../utils'
import { plainToInstance } from 'class-transformer'
import { DBTypeMapping } from '../../../configs/types/application-constants.type'
import { CreateCustomerRequest } from '../requests/create-customer.request'
import { AppDataSources, startTransaction } from '../../../database/connection'
import { UpdateCustomerRequest } from '../requests/update-customer.request'
import { Customer } from '../entities/customer.entity'

@Service()
export class CustomerService {
    checkBranchStatus(entity: Customer) {
        if (!entity) {
            throw Errors.CustomerNotFound
        }
    }

    async getCustomers(req: GetListCustomerRequest) {
        const filter = removeUndefinedFields(
            plainToInstance(CustomerFilter, req, {
                excludeExtraneousValues: true,
            })
        )

        const query = DBTypeMapping[req.userAction.originDBType]
            .getRepository(Customer)
            .createQueryBuilder('b')
            .where(removeUndefinedFields(filter))

        if (req.search) {
            query.andWhere(
                '(b.name LIKE :search OR b.address LIKE :search OR b.phone LIKE :search or b.address like :search)',
                {
                    search: `${req.search}%`,
                }
            )
        }

        const countQuery = query.clone()

        const [branchs, total] = await Promise.all([
            query
                .limit(req.pagination.limit)
                .offset(req.pagination.getOffset())
                .orderBy('b.createdTime', 'ASC')
                .getMany(),
            countQuery.getCount(),
        ])

        req.pagination.total = total

        return branchs
    }

    async createCustomer(req: CreateCustomerRequest) {
        return await startTransaction(
            AppDataSources.master,
            async (manager) => {
                const entity = plainToInstance(Customer, req, {
                    excludeExtraneousValues: true,
                })

                entity.setCreatedAndUpdatedBy(req.userAction.userId)

                await manager.insert(Customer, entity)

                return entity
            }
        )
    }

    async updateCustomer(req: UpdateCustomerRequest) {
        await startTransaction(AppDataSources.master, async (manager) => {
            await manager.update(Customer, req.customerId, req.getDataUpdate())
        })

        return true
    }

    async deleteCustomer(customerId: number) {
        return await startTransaction(
            AppDataSources.master,
            async (manager) => {
                await manager.softDelete(Customer, { customerId })
            }
        )
    }
}
