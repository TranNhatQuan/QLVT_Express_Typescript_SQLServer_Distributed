import { Column, Entity, PrimaryColumn } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'
import { UserRole } from '../types/role.type'
import { randomUUID } from 'crypto'
import { Expose } from 'class-transformer'

@Entity('User')
export class User extends AppBaseEntity {
    @Expose()
    @PrimaryColumn({ type: 'varchar', nullable: false, length: 255 })
    userId: string

    @Expose()
    @Column({ type: 'varchar', length: 255, unique: true })
    username: string

    @Expose()
    @Column({ type: 'varchar', length: 255 })
    password: string

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
    @Column({ type: 'date', nullable: false })
    dob: Date

    @Expose()
    @Column({
        type: 'int',
        nullable: false,
        default: UserRole.Staff,
    })
    role: UserRole

    @Expose()
    @Column({
        type: 'varchar',
        nullable: false,
        length: 50,
    })
    branchId: string

    genId() {
        this.userId = 'NV' + new Date().getTime().toString() + randomUUID()
    }
}
