import { Expose, Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { ToInt } from '../../../utils/transform'

export class SettingUpdateRequestDTO {
    @Expose()
    @IsOptional()
    @IsString()
    @MaxLength(255)
    section?: string

    @Expose()
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    key: string

    @Expose()
    @IsOptional()
    @Transform((value) => {
        return JSON.stringify(value.value)
    })
    value?: string

    updatedBy: string
}

export class SettingUpdateDTO {
    @Expose()
    @Transform(ToInt)
    settingId: number

    @Expose()
    section: string

    @Expose()
    value: string

    @Expose()
    updatedBy: string
}
