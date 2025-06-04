import { IsOptional, IsEnum, IsUUID, IsInt, Min, Max } from "class-validator"
import { Type } from "class-transformer"
import { NotificationStatus } from "../entities/notification.entity"

export class NotificationQueryDto {
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus

  @IsOptional()
  @IsUUID()
  userId?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0
}
