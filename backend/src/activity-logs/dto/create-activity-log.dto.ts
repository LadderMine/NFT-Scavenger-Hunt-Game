import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator"
import { ActivityAction, ActivitySeverity, ActivityCategory } from "../interfaces/activity-constants"

export class CreateActivityLogDto {
  @IsOptional()
  @IsUUID()
  userId?: string

  @IsNotEmpty()
  @IsEnum(ActivityAction)
  action: ActivityAction

  @IsOptional()
  @IsEnum(ActivityCategory)
  category?: ActivityCategory

  @IsOptional()
  @IsEnum(ActivitySeverity)
  severity?: ActivitySeverity

  @IsOptional()
  metadata?: Record<string, any>

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
  userAgent?: string

  @IsOptional()
  @IsString()
  sessionId?: string

  @IsOptional()
  @IsString()
  requestId?: string

  @IsOptional()
  @IsString()
  requestPath?: string

  @IsOptional()
  @IsString()
  requestMethod?: string

  @IsOptional()
  @IsNumber()
  statusCode?: number

  @IsOptional()
  @IsNumber()
  duration?: number

  @IsOptional()
  @IsString()
  geoLocation?: string
}

