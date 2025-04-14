import { DataSource, EntityManager } from "typeorm";
import { config } from "../configs";
const { masterDb, shardHCM, shardHN, shardUser } = config;
const rootPath = config.isProduction() ? "dist" : "src";

export const AppDataSources = {
  master: new DataSource({
    type: "mssql",
    entities: [
      rootPath + "/modules/*/entities/*.entity.{ts,js}",
      rootPath + "/modules/*/*/entities/*.entity.{ts,js}",
    ],
    host: masterDb.host,
    port: masterDb.port,
    username: masterDb.username,
    password: masterDb.password,
    database: masterDb.database,
    maxQueryExecutionTime: 10000,
    logging: false,
    synchronize: false,
  }),
  shardUser: new DataSource({
    type: "mssql",
    entities: [
      rootPath + "/modules/*/entities/*.entity.{ts,js}",
      rootPath + "/modules/*/*/entities/*.entity.{ts,js}",
    ],
    host: shardUser.host,
    port: shardUser.port,
    username: shardUser.username,
    password: shardUser.password,
    database: shardUser.database,
    maxQueryExecutionTime: 10000,
    logging: false,
    synchronize: false,
  }),
  shardHCM: new DataSource({
    type: "mssql",
    entities: [
      rootPath + "/modules/*/entities/*.entity.{ts,js}",
      rootPath + "/modules/*/*/entities/*.entity.{ts,js}",
    ],
    host: shardHCM.host,
    port: shardHCM.port,
    username: shardHCM.username,
    password: shardHCM.password,
    database: shardHCM.database,
    maxQueryExecutionTime: 10000,
    logging: false,
    synchronize: false,
  }),
  shardHN: new DataSource({
    type: "mssql",
    entities: [
      rootPath + "/modules/*/entities/*.entity.{ts,js}",
      rootPath + "/modules/*/*/entities/*.entity.{ts,js}",
    ],
    host: shardHN.host,
    port: shardHN.port,
    username: shardHN.username,
    password: shardHN.password,
    database: shardHN.database,
    maxQueryExecutionTime: 10000,
    logging: false,
    synchronize: false,
  }),
};

export const startTransaction = async <T>(
  source = AppDataSources.master,
  runInTransaction: (entityManager: EntityManager) => Promise<T>
) => {
  const queryRunner = source.createQueryRunner();

  try {
    return await queryRunner.connection.transaction(runInTransaction);
  } finally {
    await queryRunner.release();
  }
};

export const createQueryManager = async <T>(
  source = AppDataSources.master,
  handler: (manager: EntityManager) => Promise<T>
) => {
  const queryRunner = source.createQueryRunner();

  try {
    const { manager } = queryRunner;
    return await handler(manager);
  } finally {
    await queryRunner.release();
  }
};

export const initDataSource = async () => {
  await AppDataSources.master.initialize();
  await AppDataSources.shardUser.initialize();
  await AppDataSources.shardHCM.initialize();
  await AppDataSources.shardHN.initialize();
};
