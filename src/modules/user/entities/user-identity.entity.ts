import {
    BaseEntity,
    Column,
    Entity,
    EntityManager,
    PrimaryColumn,
} from 'typeorm'
import { Expose } from 'class-transformer'

@Entity('UserIdentity')
export class UserIdentity extends BaseEntity {
    @Expose()
    @PrimaryColumn({ type: 'varchar', nullable: false, length: 50 })
    branchId: string

    @Expose()
    @Column({ type: 'int', nullable: false, default: 0 })
    num: number

    async getForUpdate(manager: EntityManager) {
        const num = await manager.findOne(UserIdentity, {
            where: {
                branchId: this.branchId,
            },
            lock: {
                mode: 'pessimistic_write',
            },
            select: {
                num: true,
            },
        })

        this.num = num.num
    }

    async increaseIdentity(manager: EntityManager) {
        return await manager
            .createQueryBuilder()
            .update(UserIdentity)
            .set({ num: () => 'num + 1' })
            .where({ branchId: this.branchId })
            .execute()
    }
}
