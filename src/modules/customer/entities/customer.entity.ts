import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'

@Entity('Customer')
export class CustomerEntity extends AppBaseEntity {
    @PrimaryGeneratedColumn()
    customerId: number

    @Column({
        type: 'varchar',
        nullable: false,
        length: 50,
    })
    name: string

    @Column({
        type: 'varchar',
        nullable: false,
        length: 255,
    })
    address: string

    @Column({
        type: 'varchar',
        nullable: false,
        length: 255,
    })
    phone: string

    @Column({
        type: 'varchar',
        nullable: true,
        length: 255,
    })
    email: string

    @Column({
        type: 'text',
        nullable: true,
    })
    note: string
}
