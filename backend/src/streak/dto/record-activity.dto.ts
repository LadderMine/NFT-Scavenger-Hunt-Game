import { IsEnum, IsOptional, IsString, IsInt, Min, IsDateString } from "class-validator"
import { ActivityType } from "../entities/streak-activity.entity"

export class RecordActivityDto {
  @IsEnum(ActivityType)
  activityType: ActivityType

  @IsOptional()
  @IsDateString()
  activityDate?: string // If not provided, uses current date

  @IsOptional()
  @IsInt()
  @Min(1)
  activityCount?: number

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  metadata?: any
}
