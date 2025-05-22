import { Column, Entity, EntityManager, PrimaryColumn } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'
import { UserRole } from '../types/role.type'
import { Expose } from 'class-transformer'
import { Identity } from '../../identity/entities/identity.entity'
import { IdentityType } from '../../identity/types/identity.type'

@Entity('User')
export class User extends AppBaseEntity {
    @Expose()
    @PrimaryColumn({ type: 'varchar', nullable: false, length: 255 })
    userId: string

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

    async genId(manager: EntityManager) {
        const userIdentity = new Identity()
        userIdentity.branchId = this.branchId
        userIdentity.name = IdentityType.User

        await userIdentity.getForUpdate(manager)

        this.userId =
            this.branchId + '-' + userIdentity.num.toString().padStart(10, '0')

        await userIdentity.increaseIdentity(manager)
    }

    hideInfo() {
        delete this.password
    }
}
