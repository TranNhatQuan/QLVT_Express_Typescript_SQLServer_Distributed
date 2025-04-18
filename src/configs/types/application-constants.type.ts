import { DataSource } from 'typeorm'
import { AppDataSources } from '../../database/connection'

export enum DBType {
    HCM = 'CN-HCM',
    HN = 'CN-HN',
    USER = 'USER',
    MASTER = 'MASTER',
}

export const DBTypeMapping: {
    [key in DBType]: DataSource
} = {
    [DBType.HCM]: AppDataSources.shardHCM,
    [DBType.HN]: AppDataSources.shardHN,
    [DBType.USER]: AppDataSources.shardUser,
    [DBType.MASTER]: AppDataSources.master,
}
