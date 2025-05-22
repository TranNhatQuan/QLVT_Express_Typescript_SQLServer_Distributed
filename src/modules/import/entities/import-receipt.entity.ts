import { Column, Entity, EntityManager, PrimaryColumn } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'
import { Expose } from 'class-transformer'
import { Identity } from '../../identity/entities/identity.entity'
import { IdentityType } from '../../identity/types/identity.type'

@Entity('ImportReceipt')
export class ImportReceipt extends AppBaseEntity {
    @Expose()
    @PrimaryColumn({ type: 'varchar', nullable: false, length: 50 })
    importId: string

    @Expose()
    @Column({
        type: 'varchar',
        nullable: false,
    })
    orderId: number

    @Expose()
    @Column({ type: 'int', nullable: false })
    warehouseId: number

    async genId(manager: EntityManager, branchId: string) {
        const userIdentity = new Identity()
        userIdentity.branchId = branchId
        userIdentity.name = IdentityType.Import

        await userIdentity.getForUpdate(manager)

        this.importId =
            branchId + '-' + userIdentity.num.toString().padStart(10, '0')

        await userIdentity.increaseIdentity(manager)
    }
}
