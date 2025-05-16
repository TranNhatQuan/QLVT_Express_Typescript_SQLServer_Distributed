import { Column, Entity, PrimaryColumn } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'
import { OrderType } from '../types/order.type'
import { OrderStatus } from '../types/order-status.type'

@Entity('Order')
export class Order extends AppBaseEntity {
    @PrimaryColumn({ type: 'varchar', nullable: false, length: 50 })
    orderId: string

    @Column({
        type: 'varchar',
        nullable: false,
        default: OrderType.Import,
    })
    type: OrderType

    @Column({
        type: 'varchar',
        nullable: false,
        default: OrderStatus.Init,
    })
    status: OrderStatus

    @Column({ type: 'varchar', nullable: false, length: 255 })
    userId: string

    @Column({ type: 'int', nullable: true })
    sourceWarehouseId?: number

    @Column({ type: 'int', nullable: true })
    destinationWarehouseId?: number

    @Column({ type: 'int', nullable: true })
    customerId?: number
}
