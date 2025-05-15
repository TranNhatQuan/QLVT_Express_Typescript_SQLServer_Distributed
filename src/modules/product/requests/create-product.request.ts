import { Expose } from 'class-transformer'
import { IsNotEmpty, MaxLength } from 'class-validator'
import { UserDTO } from '../../user/dtos/user.dto'

export class CreateProductRequest {
    @Expose()
    @IsNotEmpty()
    branchId: string

    @Expose()
    @MaxLength(50)
    @IsNotEmpty()
    name: string

    @Expose()
    @MaxLength(255)
    @IsNotEmpty()
    address: string

    userAction?: UserDTO
}
