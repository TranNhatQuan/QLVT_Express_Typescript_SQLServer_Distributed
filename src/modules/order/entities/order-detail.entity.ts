import { Column, Entity, PrimaryColumn } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'
import { ColumnNumericTransformer } from '../../../database/transformers/column-numeric.transformer'
import { Expose } from 'class-transformer'

@Entity('OrderDetail')
export class OrderDetail extends AppBaseEntity {
    @Expose()
    @PrimaryColumn({ type: 'varchar', nullable: false, length: 50 })
    orderId: string

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

    @Expose()
    @Column({
        type: 'decimal',
        precision: 15,
        scale: 3,
        nullable: false,
        unsigned: true,
        transformer: new ColumnNumericTransformer(),
    })
    price: number
}
