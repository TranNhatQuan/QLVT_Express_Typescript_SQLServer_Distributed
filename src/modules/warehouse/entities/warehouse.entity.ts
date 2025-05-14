import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'

@Entity('Warehouse')
export class Warehouse extends AppBaseEntity {
    @PrimaryGeneratedColumn()
    warehouseId: number

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
        length: 50,
    })
    branchId: string
}
