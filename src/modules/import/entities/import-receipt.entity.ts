import { Column, Entity, PrimaryColumn } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'
import { Expose } from 'class-transformer'

@Entity('ImportReceipt')
export class ImportReceipt extends AppBaseEntity {
    @Expose()
    @PrimaryColumn({ type: 'varchar', nullable: false, length: 50 })
    importId: string

    @Expose()
    @Column({
        type: 'varchar',
        nullable: false,
    })
    orderId: number

    @Expose()
    @Column({ type: 'varchar', nullable: false, length: 255 })
    userId: string

    @Expose()
    @Column({ type: 'int', nullable: false })
    warehouseId: number
}
