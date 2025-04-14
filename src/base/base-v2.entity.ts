import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export class AppBaseEntityV2 extends BaseEntity {
  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @Column({ type: "varchar", length: 255, nullable: true, default: "0" })
  createdBy: string;

  @Column({ type: "varchar", length: 255, nullable: true, default: "0" })
  updatedBy: string;
}
