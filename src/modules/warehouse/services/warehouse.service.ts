import { Service } from 'typedi'
import { Errors } from '../../../utils/error'
import { removeUndefinedFields } from '../../../utils'
import { plainToInstance } from 'class-transformer'
import { DBTypeMapping } from '../../../configs/types/application-constants.type'
import { AppDataSources, startTransaction } from '../../../database/connection'
import { Warehouse } from '../entities/warehouse.entity'
import {
    GetListWarehouseRequest,
    WarehouseFilter,
} from '../requests/get-list-warehouse.request'
import { CreateWarehouseRequest } from '../requests/create-warehouse.request'
import { UpdateWarehouseRequest } from '../requests/update-warehouse.request'

@Service()
export class WarehouseService {
    checkStatus(entity: Warehouse) {
        if (!entity) {
            throw Errors.WarehouseNotFound
        }
    }

    async getWarehouses(req: GetListWarehouseRequest) {
        const filter = removeUndefinedFields(
            plainToInstance(WarehouseFilter, req, {
                excludeExtraneousValues: true,
            })
        )

        const query = DBTypeMapping[req.dbType]
            .getRepository(Warehouse)
            .createQueryBuilder('b')
            .where(removeUndefinedFields(filter))

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

    async createWarehouse(req: CreateWarehouseRequest) {
        console.log('req', req)

        return await startTransaction(
            DBTypeMapping[req.branchId],
            async (manager) => {
                const branchEntity = plainToInstance(Warehouse, req, {
                    excludeExtraneousValues: true,
                })

                branchEntity.setCreatedAndUpdatedBy(req.userAction.userId)

                await manager.insert(Warehouse, branchEntity)

                return branchEntity
            }
        )
    }

    async updateWarehouse(req: UpdateWarehouseRequest) {
        await startTransaction(AppDataSources.master, async (manager) => {
            manager.update(Warehouse, req.warehouseId, req.getDataUpdate())
        })

        return true
    }

    async deleteWarehouse(warehouseId: number) {
        return await startTransaction(
            AppDataSources.master,
            async (manager) => {
                await manager.softDelete(Warehouse, {
                    warehouseId,
                })
            }
        )
    }
}
