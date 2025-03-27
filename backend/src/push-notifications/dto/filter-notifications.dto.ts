import { IsOptional, IsEnum, IsBoolean, IsUUID, IsDateString } from "class-validator"
import { Transform } from "class-transformer"
import { NotificationType } from "../entities/notification.entity"

export class FilterNotificationsDto {
  @IsOptional()
  @IsUUID()
  userId?: string

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === "true") return true
    if (value === "false") return false
    return value
  })
  isRead?: boolean

  @IsOptional()
  @IsDateString()
  startDate?: string

  @IsOptional()
  @IsDateString()
  endDate?: string

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === "true") return true
    if (value === "false") return false
    return value
  })
  systemWide?: boolean
}

