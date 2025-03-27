import { IsBoolean, IsNotEmpty } from "class-validator"

export class UpdateNotificationDto {
  @IsNotEmpty()
  @IsBoolean()
  isRead: boolean
}

