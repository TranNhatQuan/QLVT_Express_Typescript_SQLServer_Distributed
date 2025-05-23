import { Service } from 'typedi'
import { Errors } from '../../../utils/error'

import { removeUndefinedFields } from '../../../utils'
import { plainToInstance } from 'class-transformer'
import { DBTypeMapping } from '../../../configs/types/application-constants.type'
import { AppDataSources, startTransaction } from '../../../database/connection'
import { ImportReceipt } from '../entities/import-receipt.entity'
import {
    GetListImportRequest,
    ImportFilter,
} from '../requests/get-list-import.request'
import { CreateImportRequest } from '../requests/create-import.request'
import { ImportReceiptDetail } from '../entities/import-receipt-detail.entity'

@Service()
export class ImportService {
    checkStatus(entity: ImportReceipt) {
        if (!entity) {
            throw Errors.ImportNotFound
        }
    }

    async getImports(req: GetListImportRequest) {
        const filter = removeUndefinedFields(
            plainToInstance(ImportFilter, req, {
                excludeExtraneousValues: true,
            })
        )

        const query = DBTypeMapping[req.dbType]
            .getRepository(ImportReceipt)
            .createQueryBuilder('b')
            .where(removeUndefinedFields(filter))
            .select([
                'b.importId importId',
                'b.orderId orderId',
                'b.createdTime',
                'b.updatedTime',
                'b.createdBy',
                'b.updatedBy',
                'b.warehouseId warehouseId',
            ])

        const countQuery = query.clone()

        if (req.productId) {
            query
                .leftJoin(
                    ImportReceiptDetail,
                    'ird',
                    'ird.importReceiptId = b.importId'
                )
                .andWhere('ird.productId = :productId', {
                    productId: req.productId,
                })
                .groupBy(
                    'b.importId, b.orderId, b.createdTime, b.updatedTime, b.createdBy, b.updatedBy, b.warehouseId'
                )
        }

        const [branchs, total] = await Promise.all([
            query
                .limit(req.pagination.limit)
                .offset(req.pagination.getOffset())
                .orderBy('b.createdTime', 'ASC')
                .getRawMany(),
            countQuery.getCount(),
        ])

        req.pagination.total = total

        return branchs
    }

    async createImport(req: CreateImportRequest) {
        return await startTransaction(
            DBTypeMapping[req.userAction.originDBType],
            async (manager) => {
                await req.validateRequest(manager)

                const entity = plainToInstance(ImportReceipt, req, {
                    excludeExtraneousValues: true,
                })

                entity.setCreatedAndUpdatedBy(req.userAction.userId)

                await entity.genId(manager, req.warehouse.branchId)

                await manager.insert(ImportReceipt, entity)

                const details = []

                for (const detail of req.details) {
                    const detailEntity = plainToInstance(
                        ImportReceiptDetail,
                        detail,
                        {
                            excludeExtraneousValues: true,
                        }
                    )

                    detailEntity.setCreatedAndUpdatedBy(req.userAction.userId)

                    detailEntity.importId = entity.importId

                    await manager.insert(ImportReceiptDetail, detailEntity)

                    details.push(detailEntity)
                }

                entity['details'] = details

                return entity
            }
        )
    }
}
