import { Column, Entity, PrimaryColumn } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'
import { ColumnNumericTransformer } from '../../../database/transformers/column-numeric.transformer'
import { Expose } from 'class-transformer'

@Entity('ImportReceiptDetail')
@Expose()
export class ImportReceiptDetail extends AppBaseEntity {
    @Expose()
    @PrimaryColumn({ type: 'varchar', nullable: false, length: 50 })
    importId: string

    @Expose()
    @PrimaryColumn({ type: 'int', nullable: false })
    productId: number

    @Expose()
    @Column({
        type: 'decimal',
        precision: 15,
        scale: 3,
        nullable: false,
        unsigned: true,
        transformer: new ColumnNumericTransformer(),
    })
    quantity: number
}
