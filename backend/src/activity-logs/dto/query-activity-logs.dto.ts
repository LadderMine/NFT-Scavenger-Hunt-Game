import { IsArray, IsBoolean, IsDateString, IsEnum, IsOptional, IsString, IsUUID } from "class-validator"
import { Transform, Type } from "class-transformer"
import { ActivityAction, ActivitySeverity, ActivityCategory } from "../interfaces/activity-constants"

export class QueryActivityLogsDto {
  @IsOptional()
  @IsUUID()
  userId?: string

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  @Transform(({ value }) => (typeof value === "string" ? [value] : value))
  userIds?: string[]

  @IsOptional()
  @IsEnum(ActivityAction)
  action?: ActivityAction

  @IsOptional()
  @IsArray()
  @IsEnum(ActivityAction, { each: true })
  @Transform(({ value }) => (typeof value === "string" ? [value] : value))
  actions?: ActivityAction[]

  @IsOptional()
  @IsEnum(ActivityCategory)
  category?: ActivityCategory

  @IsOptional()
  @IsArray()
  @IsEnum(ActivityCategory, { each: true })
  @Transform(({ value }) => (typeof value === "string" ? [value] : value))
  categories?: ActivityCategory[]

  @IsOptional()
  @IsEnum(ActivitySeverity)
  severity?: ActivitySeverity

  @IsOptional()
  @IsArray()
  @IsEnum(ActivitySeverity, { each: true })
  @Transform(({ value }) => (typeof value === "string" ? [value] : value))
  severities?: ActivitySeverity[]

  @IsOptional()
  @IsString()
  resourceType?: string

  @IsOptional()
  @IsString()
  resourceId?: string

  @IsOptional()
  @IsString()
  ipAddress?: string

  @IsOptional()
  @IsString()
  sessionId?: string

  @IsOptional()
  @IsString()
  requestId?: string

  @IsOptional()
  @IsDateString()
  startDate?: string

  @IsOptional()
  @IsDateString()
  endDate?: string

  @IsOptional()
  @Type(() => Number)
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  limit?: number = 10

  @IsOptional()
  @IsString()
  sortBy?: string = "createdAt"

  @IsOptional()
  @IsString()
  sortOrder?: "ASC" | "DESC" = "DESC"

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  includeAnonymized?: boolean = false

  @IsOptional()
  @IsString()
  searchTerm?: string
}

