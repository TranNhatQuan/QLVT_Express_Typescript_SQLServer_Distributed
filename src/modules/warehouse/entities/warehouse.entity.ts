import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'
import { Expose } from 'class-transformer'

@Entity('Warehouse')
export class Warehouse extends AppBaseEntity {
    @Expose()
    @PrimaryGeneratedColumn()
    warehouseId: number

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
        length: 50,
    })
    branchId: string
}
