import { Pagination } from "../utils/response";
import { Expose, Transform } from "class-transformer";

export class BasePaginationReq {
  @Expose()
  @Transform((src) => {
    return Pagination.fromQuery(src.obj);
  })
  pagination: Pagination;
}
