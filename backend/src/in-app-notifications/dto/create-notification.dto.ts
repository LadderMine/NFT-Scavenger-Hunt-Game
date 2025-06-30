import { IsString, IsEnum, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InAppNotificationType } from '../entities/in-app-notification.entity';

export class CreateNotificationDto {
  @ApiProperty({ description: 'Title of the notification' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Message content of the notification' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'Type of notification', enum: InAppNotificationType })
  @IsEnum(InAppNotificationType)
  type: InAppNotificationType;

  @ApiProperty({ description: 'ID of the user who should receive this notification', required: false })
  @IsNumber()
  @IsOptional()
  userId?: number;
}