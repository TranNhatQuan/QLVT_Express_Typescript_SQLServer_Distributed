import { Expose } from 'class-transformer'

export class BaseDTO {
    @Expose()
    createdTime: Date

    @Expose()
    updatedTime: Date
}
