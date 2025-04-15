import { Expose, Transform } from 'class-transformer'
import { ToBoolean, ToInt } from '../../../utils/transform'
import { SettingMappingValueTypes } from '../types/setting-mapping-value-types.type'

export class SettingDTO {
    @Expose()
    @Transform(ToInt)
    settingId: number

    @Expose()
    section: string

    @Expose()
    key: string

    @Expose()
    @Transform((src) => {
        return SettingMappingValueTypes[src.obj.key]?.(src.value) ?? src.value
    })
    value: any

    @Expose()
    @Transform(ToBoolean)
    isHidden: boolean
}
