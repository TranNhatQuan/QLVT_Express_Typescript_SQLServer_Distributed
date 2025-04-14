import { BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

export class AppBaseEntityWithoutCreatedBy extends BaseEntity {
  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;
}
