import {
  DataSource,
  EntityManager,
  ReplicationMode,
  SelectQueryBuilder,
} from "typeorm";
import { config } from "../configs";

const { masterDb, slavesDb } = config;
const rootPath = config.isProduction() ? "dist" : "src";

export const AppDataSource = new DataSource({
  type: "mysql",
  entities: [
    rootPath + "/modules/*/entities/*.entity.{ts,js}",
    rootPath + "/modules/*/*/entities/*.entity.{ts,js}",
  ],
  replication: {
    master: {
      host: masterDb.host,
      port: masterDb.port,
      username: masterDb.username,
      password: masterDb.password,
      database: masterDb.database,
    },
    slaves: slavesDb.map((i) => {
      return {
        host: i.host,
        port: i.port,
        username: i.username,
        password: i.password,
        database: i.database,
      };
    }),
  },
  cache: {
    type: "ioredis",
    options: config.redis,
    ignoreErrors: false,
  },
  maxQueryExecutionTime: 10000,
  logging: config.isLocal(), // && false,
  synchronize: false, // only run sync when debug or develop
});

export const startTransaction = async <T>(
  runInTransaction: (entityManager: EntityManager) => Promise<T>
) => {
  const queryRunner = AppDataSource.createQueryRunner("master");

  try {
    return await queryRunner.connection.transaction(runInTransaction);
  } finally {
    await queryRunner.release();
  }
};

export type DBSource = ReplicationMode | EntityManager;

/** Create a query builder based on dbsource
 *
 * - ReplicationMode: Perform queries on a single database connection (MASTER | SLAVE).
 * - EntityManager: Used for custom entity manager, like performing queries in transaction.
 */
export const createQuery = async <T>(
  db: DBSource,
  handler: (builder: SelectQueryBuilder<unknown>) => Promise<T>
) => {
  if (db instanceof EntityManager) {
    return await handler(db.createQueryBuilder());
  }
  if (typeof db === "string") {
    const queryRunner = AppDataSource.createQueryRunner(db);
    try {
      return await handler(
        AppDataSource.createQueryBuilder().setQueryRunner(queryRunner)
      );
    } finally {
      await queryRunner.release();
    }
  }
  throw new Error("Invalid db source");
};

export const createQueryManager = async <T>(
  db: DBSource,
  handler: (manager: EntityManager) => Promise<T>
) => {
  if (db instanceof EntityManager) {
    return await handler(db);
  }

  if (db === "slave") {
    return await handler(AppDataSource.manager);
  }

  // create a connection to MASTER database
  const queryRunner = AppDataSource.createQueryRunner(db);

  try {
    const { manager } = queryRunner;
    return await handler(manager);
  } finally {
    await queryRunner.release();
  }
};
