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

@Service()
export class ImportService {
    checkStatus(branchEntity: ImportReceipt) {
        if (!branchEntity) {
            throw Errors.BranchNotFound
        }
    }

    async getBranchs(req: GetListImportRequest) {
        const filter = removeUndefinedFields(
            plainToInstance(ImportFilter, req, {
                excludeExtraneousValues: true,
            })
        )

        const query = DBTypeMapping[req.dbType]
            .getRepository(ImportReceipt)
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

    async createBranch(req: CreateImportRequest) {
        return await startTransaction(
            AppDataSources.master,
            async (manager) => {
                const branchEntity = plainToInstance(ImportReceipt, req, {
                    excludeExtraneousValues: true,
                })

                branchEntity.setCreatedAndUpdatedBy(req.userAction.userId)

                await manager.insert(ImportReceipt, branchEntity)

                return branchEntity
            }
        )
    }
}
