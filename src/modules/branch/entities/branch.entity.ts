import { Column, Entity, PrimaryColumn } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'

@Entity('Branch')
export class Branch extends AppBaseEntity {
    @PrimaryColumn({ type: 'varchar', nullable: false, length: 50 })
    branchId: string

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
}
