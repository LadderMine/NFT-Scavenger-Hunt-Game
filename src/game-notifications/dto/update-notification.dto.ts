import { IsEnum, IsOptional } from "class-validator"
import { NotificationStatus } from "../entities/notification.entity"

export class UpdateNotificationDto {
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus
}
