import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'
import { Expose } from 'class-transformer'

@Entity('Product')
export class Product extends AppBaseEntity {
    @Expose()
    @PrimaryGeneratedColumn()
    productId: number

    @Expose()
    @Column({
        type: 'varchar',
        nullable: false,
        length: 50,
        unique: true,
    })
    name: string

    @Expose()
    @Column({
        type: 'varchar',
        nullable: false,
        length: 50,
    })
    unit: string
}
