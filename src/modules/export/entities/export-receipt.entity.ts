import { Column, Entity, PrimaryColumn } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'

@Entity('ExportReceipt')
export class ExportReceipt extends AppBaseEntity {
    @PrimaryColumn({ type: 'varchar', nullable: false, length: 50 })
    exportId: string

    @Column({
        type: 'varchar',
        nullable: false,
    })
    orderId: number

    @Column({ type: 'varchar', nullable: false, length: 255 })
    userId: string

    @Column({ type: 'int', nullable: false })
    warehouseId: number
}
