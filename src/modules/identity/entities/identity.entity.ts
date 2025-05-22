import {
    BaseEntity,
    Column,
    Entity,
    EntityManager,
    PrimaryColumn,
} from 'typeorm'
import { Expose } from 'class-transformer'

@Entity('Identity')
export class Identity extends BaseEntity {
    @Expose()
    @PrimaryColumn({ type: 'varchar', nullable: false, length: 50 })
    branchId: string

    @Expose()
    @PrimaryColumn({ type: 'varchar', nullable: false, length: 255 })
    name: string

    @Expose()
    @Column({ type: 'int', nullable: false, default: 0 })
    num: number

    async getForUpdate(manager: EntityManager) {
        const num = await manager.findOne(Identity, {
            where: {
                branchId: this.branchId,
                name: this.name,
            },
            lock: {
                mode: 'pessimistic_write',
            },
            select: {
                num: true,
            },
        })

        if (!num) {
            await manager.insert(Identity, {
                branchId: this.branchId,
                name: this.name,
                num: 0,
            })

            this.num = 0

            return
        }

        this.num = num.num
    }

    async increaseIdentity(manager: EntityManager) {
        return await manager
            .createQueryBuilder()
            .update(Identity)
            .set({ num: () => 'num + 1' })
            .where({ branchId: this.branchId, name: this.name })
            .execute()
    }
}
