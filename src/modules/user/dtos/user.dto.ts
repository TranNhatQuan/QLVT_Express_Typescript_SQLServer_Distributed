import { Expose } from 'class-transformer'
import { UserRole } from '../types/role.type'
import { DBType } from '../../../configs/types/application-constants.type'

export class UserDTO {
    @Expose()
    userId: string

    @Expose()
    username: string

    @Expose()
    password: string

    @Expose()
    name: string

    @Expose()
    address: string

    @Expose()
    phone: string

    @Expose()
    email?: string

    @Expose()
    dob: Date

    @Expose()
    role: UserRole

    @Expose()
    branchId: string

    originDBType?: DBType

    loadOrginDBType() {
        this.originDBType = DBType[this.branchId]
    }
}
