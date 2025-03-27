import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"
import { NotificationType } from "../entities/notification.entity"

export class CreateNotificationDto {
  @IsOptional()
  @IsUUID()
  userId?: string

  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  message: string

  @IsEnum(NotificationType)
  type: NotificationType
}

