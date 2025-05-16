import { Expose, Type } from 'class-transformer'
import { Order } from '../entities/order.entity'
import { OrderDetail } from '../entities/order-detail.entity'
import { ImportDTO } from '../../import/dtos/import.dto'
import { ExportDTO } from '../../export/dtos/export.dto'

export class OrderDetailDTO extends OrderDetail {
    @Expose()
    exportDone?: boolean

    @Expose()
    importDone?: boolean

    @Expose()
    importedQuantity?: number

    @Expose()
    exportedQuantity?: number
}

export class OrderDTO extends Order {
    @Expose()
    @Type(() => OrderDetailDTO)
    details?: OrderDetailDTO[]

    @Expose()
    @Type(() => ImportDTO)
    importDetails?: ImportDTO[]

    @Expose()
    @Type(() => ExportDTO)
    exportDetails?: ExportDTO[]

    @Expose()
    exportDone?: boolean

    @Expose()
    importDone?: boolean
}
