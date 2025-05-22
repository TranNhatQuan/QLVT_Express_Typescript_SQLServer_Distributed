import { Expose, Transform, Type } from 'class-transformer'
import { ExportReceiptDetail } from '../entities/export-receipt-detail.entity'
import { ExportReceipt } from '../entities/export-receipt.entity'

export class ExportDTO extends ExportReceipt {
    @Expose()
    @Transform(({ obj }) => {
        if (obj.jsonDetails) {
            return JSON.parse(obj.jsonDetails)
        }

        return obj.details
    })
    @Type(() => ExportReceiptDetailDTO)
    details: ExportReceiptDetailDTO[]
}

export class ExportReceiptDetailDTO extends ExportReceiptDetail {
    @Expose()
    productName?: string

    @Expose()
    productUnit?: string
}
