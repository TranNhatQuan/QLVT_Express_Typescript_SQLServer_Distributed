import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'

@Entity('Product')
export class Product extends AppBaseEntity {
    @PrimaryGeneratedColumn()
    productId: number

    @Column({
        type: 'varchar',
        nullable: false,
        length: 50,
        unique: true,
    })
    name: string

    @Column({
        type: 'varchar',
        nullable: false,
        length: 50,
    })
    unit: string
}
