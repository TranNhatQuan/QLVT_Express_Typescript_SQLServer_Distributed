import { Expose, Transform, Type } from 'class-transformer'
import { ImportReceipt } from '../entities/import-receipt.entity'
import { ImportReceiptDetail } from '../entities/import-receipt-detail.entity'

export class ImportDTO extends ImportReceipt {
    @Expose()
    @Transform(({ obj }) => {
        if (obj.jsonDetails) {
            return JSON.parse(obj.jsonDetails)
        }

        return obj.details
    })
    @Type(() => ImportReceiptDetailDTO)
    details: ImportReceiptDetailDTO[]
}

export class ImportReceiptDetailDTO extends ImportReceiptDetail {
    @Expose()
    productName?: string

    @Expose()
    productUnit?: string
}
