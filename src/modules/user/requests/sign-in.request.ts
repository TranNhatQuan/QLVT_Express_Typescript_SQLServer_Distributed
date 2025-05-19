import { Expose } from 'class-transformer'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class SignInRequest {
    @Expose()
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    username: string

    @Expose()
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    password: string
}
