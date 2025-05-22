import { Expose } from 'class-transformer'
import { IsNotEmpty, MaxLength } from 'class-validator'
import { UserDTO } from '../../user/dtos/user.dto'

export class CreateProductRequest {
    @Expose()
    @MaxLength(50)
    @IsNotEmpty()
    name: string

    @Expose()
    @MaxLength(50)
    @IsNotEmpty()
    unit: string

    @Expose()
    userAction?: UserDTO
}
