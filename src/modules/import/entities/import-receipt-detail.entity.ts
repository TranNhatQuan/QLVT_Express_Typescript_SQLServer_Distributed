import { Column, Entity, PrimaryColumn } from "typeorm";
import { AppBaseEntity } from "../../../base/base.entity";
import { ColumnNumericTransformer } from "../../../database/transformers/column-numeric.transformer";

@Entity("ImportReceiptDetail")
export class ImportReceiptDetailEntity extends AppBaseEntity {
  @PrimaryColumn({ type: "varchar", nullable: false, length: 50 })
  importId: string;

  @PrimaryColumn({ type: "int", nullable: false })
  productId: number;

  @Column({
    type: "decimal",
    precision: 15,
    scale: 3,
    nullable: false,
    unsigned: true,
    transformer: new ColumnNumericTransformer(),
  })
  quantity: number;
}
