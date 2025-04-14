import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AppBaseEntity } from "../../../base/base.entity";

@Entity("Setting")
export class Setting extends AppBaseEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  settingId: number;

  @Column({ type: "varchar", length: 255 })
  section: string;

  @Column({ type: "text" })
  key: string;

  @Column({ type: "varchar", length: 255 })
  value: string;

  @Column({ type: "tinyint", default: 0 })
  isHidden: number;
}
