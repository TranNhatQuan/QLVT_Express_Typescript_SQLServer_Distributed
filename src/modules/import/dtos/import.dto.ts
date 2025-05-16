import { Expose, Type } from 'class-transformer'
import { ImportReceipt } from '../entities/import-receipt.entity'
import { ImportReceiptDetail } from '../entities/import-receipt-detail.entity'

export class ImportDTO extends ImportReceipt {
    @Expose()
    @Type(() => ImportReceiptDetail)
    details: ImportReceiptDetail[]
}
