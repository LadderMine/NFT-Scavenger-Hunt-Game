import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsUrl, IsNumber, Min, Max, IsArray } from 'class-validator';
import { InAppNotificationType } from '../entities/in-app-notification.entity';

export class CreateInAppNotificationDto {
  @ApiProperty({ description: 'User ID to send notification to' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'Notification title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Notification message', required: false })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ description: 'URL to navigate to when notification is clicked', required: false })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty({ description: 'Notification type', enum: InAppNotificationType, default: InAppNotificationType.GENERAL })
  @IsOptional()
  @IsEnum(InAppNotificationType)
  type?: InAppNotificationType = InAppNotificationType.GENERAL;

  @ApiProperty({ description: 'Additional metadata for the notification', required: false })
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Notification priority (0-10)', required: false, minimum: 0, maximum: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  priority?: number = 0;
}

export class MarkAsReadDto {
  @ApiProperty({ description: 'Array of notification IDs to mark as read' })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  notificationIds: number[];
}

export class ArchiveNotificationsDto {
  @ApiProperty({ description: 'Array of notification IDs to archive' })
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  notificationIds: number[];
}
