/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassConstructor, plainToInstance } from "class-transformer";
import { AppDataSource } from "./connection";

export const Procs = {
  GetCompetitionReport: "usp_Competition_getReport_func",
};

export const execProc = async <T>(
  cls: ClassConstructor<T>,
  procName: string,
  params: unknown[],
  manager = AppDataSource.manager
): Promise<T[]> => {
  const qs: string[] = new Array(params.length).fill("?");
  const result = await manager.query(
    `CALL ${procName}(${qs.join(",")})`,
    params
  );

  if (cls && Array.isArray(result) && result.length > 0) {
    return (
      plainToInstance(cls, <any[]>result[0], {
        excludeExtraneousValues: true,
      }) ?? []
    );
  }
};
