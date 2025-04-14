import { Expose } from "class-transformer";
import { IsDateString, IsISO8601, IsNotEmpty } from "class-validator";

export class DateRangeFilter {
  @Expose()
  @IsNotEmpty()
  @IsDateString({ strict: true })
  @IsISO8601({ strict: true })
  startDate: Date;

  @Expose()
  @IsNotEmpty()
  @IsDateString({ strict: true })
  @IsISO8601({ strict: true })
  endDate: Date;
}
