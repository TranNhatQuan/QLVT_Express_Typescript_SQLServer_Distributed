import { Service } from 'typedi'
import { Errors } from '../../../utils/error'
import { removeUndefinedFields } from '../../../utils'
import { plainToInstance } from 'class-transformer'
import { DBTypeMapping } from '../../../configs/types/application-constants.type'
import { CreateExportRequest } from '../requests/create-export.request'
import { AppDataSources, startTransaction } from '../../../database/connection'
import {
    ExportFilter,
    GetListExportRequest,
} from '../requests/get-list-export.request'
import { ExportReceipt } from '../entities/export-receipt.entity'

@Service()
export class ExportService {
    checkStatus(exportEntity: ExportReceipt) {
        if (!exportEntity) {
            throw Errors.ExportNotFound
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
            .createQueryBuilder('e')
            .where(filter)

        const countQuery = query.clone()

        const [exports, total] = await Promise.all([
            query
                .limit(req.pagination.limit)
                .offset(req.pagination.getOffset())
                .orderBy('e.createdTime', 'ASC')
                .getRawMany(),
            countQuery.getCount(),
        ])

        req.pagination.total = total

        return exports
    }

    async createExport(req: CreateExportRequest) {
        return await startTransaction(
            AppDataSources.master,
            async (manager) => {
                const exportEntity = plainToInstance(ExportReceipt, req, {
                    excludeExtraneousValues: true,
                })

                exportEntity.setCreatedAndUpdatedBy(req.userAction.userId)

                await manager.insert(ExportReceipt, exportEntity)

                return exportEntity
            }
        )
    }
}
