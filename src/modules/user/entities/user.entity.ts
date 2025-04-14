import { Column, Entity, PrimaryColumn } from "typeorm";
import { AppBaseEntity } from "../../../base/base.entity";
import { UserRole } from "../types/role.type";
import { randomUUID } from "crypto";

@Entity("User")
export class User extends AppBaseEntity {
  @PrimaryColumn({ type: "varchar", nullable: false, length: 255 })
  userId: string;

  @Column({
    type: "varchar",
    nullable: false,
    length: 50,
  })
  name: string;

  @Column({
    type: "varchar",
    nullable: false,
    length: 255,
  })
  address: string;

  @Column({
    type: "varchar",
    nullable: false,
    length: 255,
  })
  phone: string;

  @Column({
    type: "varchar",
    nullable: false,
    length: 255,
  })
  email: string;

  @Column({ type: "date", nullable: false })
  dob: Date;

  @Column({
    type: "varchar",
    nullable: false,
    default: UserRole.Staff,
    length: 50,
  })
  role: UserRole;

  @Column({
    type: "varchar",
    nullable: false,
    length: 50,
  })
  branchId: string;

  genId() {
    this.userId = "NV" + new Date().getTime().toString() + randomUUID();
  }
}
