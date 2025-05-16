import { Expose, Type } from 'class-transformer'
import { ExportReceiptDetail } from '../entities/export-receipt-detail.entity'
import { ExportReceipt } from '../entities/export-receipt.entity'

export class ExportDTO extends ExportReceipt {
    @Expose()
    @Type(() => ExportReceiptDetail)
    details: ExportReceiptDetail[]
}
