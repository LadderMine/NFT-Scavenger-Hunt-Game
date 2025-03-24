import { IsEnum, IsOptional } from "class-validator"
import { QueryActivityLogsDto } from "./query-activity-logs.dto"

export enum ExportFormat {
  CSV = "csv",
  JSON = "json",
  EXCEL = "excel",
}

export class ExportActivityLogsDto extends QueryActivityLogsDto {
  @IsEnum(ExportFormat)
  @IsOptional()
  format: ExportFormat = ExportFormat.CSV
}

