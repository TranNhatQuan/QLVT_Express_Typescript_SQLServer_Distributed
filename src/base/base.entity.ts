import { Expose, Type } from 'class-transformer'
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn } from 'typeorm'

export class AppBaseEntity extends BaseEntity {
    @Expose()
    @Type(() => Date)
    @CreateDateColumn()
    createdTime: Date

    @Expose()
    @Type(() => Date)
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updatedTime: Date

    @Expose()
    @Column({ type: 'varchar', length: 255, nullable: true, default: '0' })
    createdBy: string

    @Expose()
    @Column({ type: 'varchar', length: 255, nullable: true, default: '0' })
    updatedBy: string

    @DeleteDateColumn()
    deletedTime: Date

    setCreatedAndUpdatedBy(userId: string) {
        this.createdBy = userId
        this.updatedBy = userId
    }
}
