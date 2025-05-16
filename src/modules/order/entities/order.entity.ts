import { Column, Entity, PrimaryColumn } from 'typeorm'
import { AppBaseEntity } from '../../../base/base.entity'
import { OrderType } from '../types/order.type'
import { OrderStatus } from '../types/order-status.type'
import { Expose } from 'class-transformer'

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
    @Column({ type: 'varchar', nullable: false, length: 255 })
    userId: string

    @Expose()
    @Column({ type: 'int', nullable: true })
    sourceWarehouseId?: number

    @Expose()
    @Column({ type: 'int', nullable: true })
    destinationWarehouseId?: number

    @Expose()
    @Column({ type: 'int', nullable: true })
    customerId?: number
}
