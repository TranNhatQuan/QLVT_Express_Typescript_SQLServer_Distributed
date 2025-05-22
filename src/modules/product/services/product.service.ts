import { Service } from 'typedi'
import { Errors } from '../../../utils/error'
import { removeUndefinedFields } from '../../../utils'
import { plainToInstance } from 'class-transformer'
import { DBTypeMapping } from '../../../configs/types/application-constants.type'
import { AppDataSources, startTransaction } from '../../../database/connection'
import { Product } from '../entities/product.entity'
import {
    GetListProductRequest,
    ProductFilter,
} from '../requests/get-list-product.request'
import { CreateProductRequest } from '../requests/create-product.request'
import { UpdateProductRequest } from '../requests/update-product.request'
import { ImportReceiptDetail } from '../../import/entities/import-receipt-detail.entity'
import { ExportReceiptDetail } from '../../export/entities/export-receipt-detail.entity'

@Service()
export class ProductService {
    checkStatus(entity: Product) {
        if (!entity) {
            throw Errors.ProductNotFound
        }
    }

    async getProducts(req: GetListProductRequest) {
        const filter = removeUndefinedFields(
            plainToInstance(ProductFilter, req, {
                excludeExtraneousValues: true,
            })
        )

        const query = DBTypeMapping[req.dbType]
            .getRepository(Product)
            .createQueryBuilder('p')
            .where(removeUndefinedFields(filter))
            .select([
                'p.productId productId',
                'p.name name',
                'p.unit unit',
                'p.createdTime createdTime',
            ])

        const countQuery = query.clone()

        query
            .leftJoin(ImportReceiptDetail, 'ird', 'ird.productId = p.productId')
            .leftJoin(ExportReceiptDetail, 'erd', 'erd.productId = p.productId')
            .groupBy('p.productId, p.name, p.unit, p.createdTime')
            .addSelect('SUM(COALESCE(ird.quantity, 0))', 'importQuantity')
            .addSelect('SUM(COALESCE(erd.quantity, 0))', 'exportQuantity')
            .addSelect(
                'SUM(COALESCE(ird.quantity, 0)) - SUM(COALESCE(erd.quantity, 0))',
                'quantity'
            )

        const [branchs, total] = await Promise.all([
            query
                .limit(req.pagination.limit)
                .offset(req.pagination.getOffset())
                .orderBy('p.createdTime', 'ASC')
                .getRawMany(),
            countQuery.getCount(),
        ])

        req.pagination.total = total

        return branchs
    }

    async createProduct(req: CreateProductRequest) {
        return await startTransaction(
            AppDataSources.master,
            async (manager) => {
                const branchEntity = plainToInstance(Product, req, {
                    excludeExtraneousValues: true,
                })

                branchEntity.setCreatedAndUpdatedBy(req.userAction.userId)

                await manager.insert(Product, branchEntity)

                return branchEntity
            }
        )
    }

    async updateProduct(req: UpdateProductRequest) {
        await startTransaction(AppDataSources.master, async (manager) => {
            await manager.update(Product, req.productId, req.getDataUpdate())
        })

        return true
    }

    async deleteBranch(productId: number) {
        return await startTransaction(
            AppDataSources.master,
            async (manager) => {
                await manager.softDelete(Product, { productId: productId })
            }
        )
    }
}
