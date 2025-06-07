import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'
import { Expose } from 'class-transformer'

@Entity('Customer')
export class Customer extends AppBaseEntity {
    @Expose()
    @PrimaryGeneratedColumn()
    customerId: number

    @Expose()
    @Column({
        type: 'varchar',
        nullable: false,
        length: 50,
    })
    name: string

    @Expose()
    @Column({
        type: 'varchar',
        nullable: false,
        length: 255,
    })
    address: string

    @Expose()
    @Column({
        type: 'varchar',
        nullable: false,
        length: 255,
    })
    phone: string

    @Expose()
    @Column({
        type: 'varchar',
        nullable: true,
        length: 255,
    })
    email: string

    @Expose()
    @Column({
        type: 'text',
        nullable: true,
    })
    note: string
}
