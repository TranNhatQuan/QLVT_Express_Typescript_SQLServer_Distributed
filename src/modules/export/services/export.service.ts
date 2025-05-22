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
    checkStatus(branchEntity: ExportReceipt) {
        if (!branchEntity) {
            throw Errors.ExportNotFound
        }
    }

    async getBranchs(req: GetListExportRequest) {
        const filter = removeUndefinedFields(
            plainToInstance(ExportFilter, req, {
                excludeExtraneousValues: true,
            })
        )

        const query = DBTypeMapping[req.dbType]
            .getRepository(ExportReceipt)
            .createQueryBuilder('b')
            .where(removeUndefinedFields(filter))

        const countQuery = query.clone()

        const [branchs, total] = await Promise.all([
            query
                .limit(req.pagination.limit)
                .offset(req.pagination.getOffset())
                .orderBy('u.createdTime', 'ASC')
                .getRawMany(),
            countQuery.getCount(),
        ])

        req.pagination.total = total

        return branchs
    }

    async createBranch(req: CreateExportRequest) {
        return await startTransaction(
            AppDataSources.master,
            async (manager) => {
                const branchEntity = plainToInstance(ExportReceipt, req, {
                    excludeExtraneousValues: true,
                })

                branchEntity.setCreatedAndUpdatedBy(req.userAction.userId)

                await manager.insert(ExportReceipt, branchEntity)

                return branchEntity
            }
        )
    }
}
