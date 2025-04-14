import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Errors } from '../../../utils/error'

@Entity('StreetType')
export class StreetType extends BaseEntity {
    static DEFAULT_STREET_TYPE_CODE = 'OTHER'

    @PrimaryGeneratedColumn('increment')
    streetTypeId: number

    @Column({ type: 'varchar', length: 128 })
    streetTypeCode: string

    @Column({ type: 'varchar', length: 255 })
    streetTypeName: string

    static async getStreetType(streetTypeName: string) {
        return await this.findOne({
            where: { streetTypeName },
        })
    }

    static checkStatus(streetType: StreetType) {
        if (!streetType) {
            throw Errors.StreetTypeNotFound
        }
    }
}
