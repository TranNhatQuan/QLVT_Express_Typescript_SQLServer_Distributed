import { Expose, Type } from "class-transformer";

export class AppBaseModel {
  @Expose()
  @Type(() => Date)
  createdTime: Date;

  @Expose()
  @Type(() => Date)
  updatedTime: Date;

  @Expose()
  createdBy: string;

  @Expose()
  updatedBy: string;

  setCreatedAndUpdatedBy(userId: string) {
    this.createdBy = userId;
    this.updatedBy = userId;
  }
}
