import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Errors } from '../../../utils/error'

@Entity('State')
export class State extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    stateId: number

    @Column({ type: 'varchar', length: 128 })
    stateCode: string

    @Column({ type: 'varchar', length: 255 })
    stateName: string

    static async getStates() {
        return await this.find({
            order: { stateName: 'asc' },
        })
    }

    static async getStateByCode(stateCode: string) {
        return await this.findOne({ where: { stateCode } })
    }

    static checkStatus(state: State) {
        if (!state) {
            throw Errors.StateNotFound
        }
    }
}
