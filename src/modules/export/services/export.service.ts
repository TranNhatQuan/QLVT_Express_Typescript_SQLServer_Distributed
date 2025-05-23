import { Service } from 'typedi'
import { Errors } from '../../../utils/error'

import { removeUndefinedFields } from '../../../utils'
import { plainToInstance } from 'class-transformer'
import { DBTypeMapping } from '../../../configs/types/application-constants.type'
import { startTransaction } from '../../../database/connection'
import { ExportReceipt } from '../entities/export-receipt.entity'
import {
    ExportFilter,
    GetListExportRequest,
} from '../requests/get-list-export.request'
import { ExportReceiptDetail } from '../entities/export-receipt-detail.entity'
import { CreateExportRequest } from '../requests/create-export.request'

@Service()
export class ExportService {
    checkStatus(entity: ExportReceipt) {
        if (!entity) {
            throw Errors.ImportNotFound
        }
    }

    async getExports(req: GetListExportRequest) {
        const filter = removeUndefinedFields(
            plainToInstance(ExportFilter, req, {
                excludeExtraneousValues: true,
            })
        )

        const query = DBTypeMapping[req.dbType]
            .getRepository(ExportReceipt)
            .createQueryBuilder('b')
            .where(removeUndefinedFields(filter))
            .select([
                'b.exportId exportId',
                'b.orderId orderId',
                'b.createdTime createdTime',
                'b.updatedTime updatedTime',
                'b.createdBy createdBy',
                'b.updatedBy updatedBy',
                'b.warehouseId warehouseId',
            ])

        const countQuery = query.clone()

        if (req.productId) {
            query
                .leftJoin(
                    ExportReceiptDetail,
                    'ird',
                    'ird.exportId = b.exportId'
                )
                .andWhere('ird.productId = :productId', {
                    productId: req.productId,
                })
                .groupBy(
                    'b.exportId, b.orderId, b.createdTime, b.updatedTime, b.createdBy, b.updatedBy, b.warehouseId'
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

    async createExport(req: CreateExportRequest) {
        return await startTransaction(
            DBTypeMapping[req.userAction.originDBType],
            async (manager) => {
                await req.validateRequest(manager)

                const entity = plainToInstance(ExportReceipt, req, {
                    excludeExtraneousValues: true,
                })

                entity.setCreatedAndUpdatedBy(req.userAction.userId)

                await entity.genId(manager, req.warehouse.branchId)

                await manager.insert(ExportReceipt, entity)

                const details = []

                for (const detail of req.details) {
                    const detailEntity = plainToInstance(
                        ExportReceiptDetail,
                        detail,
                        {
                            excludeExtraneousValues: true,
                        }
                    )

                    detailEntity.setCreatedAndUpdatedBy(req.userAction.userId)

                    detailEntity.exportId = entity.exportId

                    await manager.insert(ExportReceiptDetail, detailEntity)

                    details.push(detailEntity)
                }

                entity['details'] = details

                return entity
            }
        )
    }
}
