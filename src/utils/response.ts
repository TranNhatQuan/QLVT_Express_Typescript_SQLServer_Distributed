/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from 'express'
import { ErrorResp, Errors } from './error'
import { Exclude, Expose } from 'class-transformer'

export class Pagination {
    @Expose()
    total: number

    @Expose()
    page: number

    @Expose()
    limit: number

    constructor(page = 1, limit = 10, total?: number) {
        if (limit > 100) {
            throw Errors.LimitInvalid
        }

        this.page = page
        this.limit = limit
        this.total = total
    }

    static fromReq = (req: Request): Pagination => {
        return this.fromQuery(req.query)
    }

    static createIgnoreValidate(page = 1, limit = 10) {
        const pagination = new Pagination()
        pagination.page = page
        pagination.limit = limit

        return pagination
    }

    static fromQuery(query: any) {
        const page = Number(query.page)
        const limit = query.limit ? Number(query.limit) : 10

        return new Pagination(isNaN(page) ? 1 : page, isNaN(limit) ? 10 : limit)
    }

    getOffset() {
        return (this.page - 1) * this.limit
    }
}

@Exclude()
export class ResponseWrapper {
    @Expose()
    data: any

    @Expose()
    error: ErrorResp

    @Expose()
    pagination: Pagination

    @Expose()
    metadata: any

    hiddenData: any

    constructor(
        data: any,
        error: ErrorResp = null,
        pagination: Pagination = null,
        metadata: any = null
    ) {
        this.data = data
        this.error = error
        this.pagination = pagination
        this.metadata = metadata
    }

    setHiddenData(data: any) {
        this.hiddenData = data
    }

    getHiddenData() {
        return this.hiddenData
    }
}
