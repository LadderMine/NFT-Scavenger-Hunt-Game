import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InAppNotificationType } from '../entities/in-app-notification.entity';

export class SystemNotificationDto {
  @ApiProperty({ description: 'Title of the system notification' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Message content of the system notification' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'Type of notification', enum: InAppNotificationType })
  @IsEnum(InAppNotificationType)
  type: InAppNotificationType;
}