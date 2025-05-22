import { Column, Entity, EntityManager, PrimaryColumn } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'
import { OrderType } from '../types/order.type'
import { OrderStatus } from '../types/order-status.type'
import { Expose } from 'class-transformer'
import { Identity } from '../../identity/entities/identity.entity'
import { IdentityType } from '../../identity/types/identity.type'

@Entity('Order')
export class Order extends AppBaseEntity {
    @Expose()
    @PrimaryColumn({ type: 'varchar', nullable: false, length: 50 })
    orderId: string

    @Expose()
    @Column({
        type: 'varchar',
        nullable: false,
        default: OrderType.Import,
    })
    type: OrderType

    @Expose()
    @Column({
        type: 'varchar',
        nullable: false,
        default: OrderStatus.Init,
    })
    status: OrderStatus

    @Expose()
    @Column({ type: 'int', nullable: true })
    sourceWarehouseId?: number

    @Expose()
    @Column({ type: 'int', nullable: true })
    destinationWarehouseId?: number

    @Expose()
    @Column({ type: 'int', nullable: true })
    customerId?: number

    async genId(manager: EntityManager, branchId: string) {
        const userIdentity = new Identity()
        userIdentity.branchId = branchId
        userIdentity.name = IdentityType.Order

        await userIdentity.getForUpdate(manager)

        this.orderId = branchId + '-' + userIdentity.num.toString()

        await userIdentity.increaseIdentity(manager)
    }
}
