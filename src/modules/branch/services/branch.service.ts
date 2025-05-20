import { Service } from 'typedi'
import { Branch } from '../entities/branch.entity'
import { Errors } from '../../../utils/error'
import {
    BranchFilter,
    GetListBranchRequest,
} from '../requests/get-list-branch.request'
import { removeUndefinedFields } from '../../../utils'
import { plainToInstance } from 'class-transformer'
import { DBTypeMapping } from '../../../configs/types/application-constants.type'
import { CreateBranchRequest } from '../requests/create-branch.request'
import { AppDataSources, startTransaction } from '../../../database/connection'
import { UpdateBranchRequest } from '../requests/update-branch.request'
import { DeleteBranchRequest } from '../requests/delete-branch.request'

@Service()
export class BranchService {
    checkBranchStatus(branchEntity: Branch) {
        if (!branchEntity) {
            throw Errors.BranchNotFound
        }
    }

    async getBranchs(req: GetListBranchRequest) {
        const filter = removeUndefinedFields(
            plainToInstance(BranchFilter, req, {
                excludeExtraneousValues: true,
            })
        )

        const query = DBTypeMapping[req.dbType]
            .getRepository(Branch)
            .createQueryBuilder()
            .from(Branch, 'b')
            .where(removeUndefinedFields(filter))

        const countQuery = query.clone()

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

    async createBranch(req: CreateBranchRequest) {
        return await startTransaction(
            AppDataSources.master,
            async (manager) => {
                const branchEntity = plainToInstance(Branch, req, {
                    excludeExtraneousValues: true,
                })

                branchEntity.setCreatedAndUpdatedBy(req.userAction.userId)

                await manager.insert(Branch, branchEntity)

                return branchEntity
            }
        )
    }

    async updateBranch(req: UpdateBranchRequest) {
        await startTransaction(AppDataSources.master, async (manager) => {
            manager.update(Branch, req.branchId, req.getDataUpdate())
        })

        return true
    }

    async deleteBranch(req: DeleteBranchRequest) {
        return await startTransaction(
            AppDataSources.master,
            async (manager) => {
                await manager.softDelete(Branch, { branchId: req.branchId })
            }
        )
    }
}
