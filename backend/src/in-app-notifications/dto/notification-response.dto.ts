import { ApiProperty } from '@nestjs/swagger';
import { InAppNotificationType } from '../entities/in-app-notification.entity';

export class NotificationResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ enum: InAppNotificationType })
  type: InAppNotificationType;

  @ApiProperty()
  isRead: boolean;

  @ApiProperty()
  recipientUserId: number;

  @ApiProperty()
  isArchived: boolean;

  @ApiProperty()
  readAt: Date;

  @ApiProperty()
  archivedAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}