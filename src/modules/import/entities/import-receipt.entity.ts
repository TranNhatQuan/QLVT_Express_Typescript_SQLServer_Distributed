import { Column, Entity, PrimaryColumn } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'

@Entity('ImportReceipt')
export class ImportReceiptEntity extends AppBaseEntity {
    @PrimaryColumn({ type: 'varchar', nullable: false, length: 50 })
    importId: string

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
