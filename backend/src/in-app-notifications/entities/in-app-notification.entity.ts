import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum InAppNotificationType {
  REWARD = 'reward',
  PUZZLE = 'puzzle',
  ANNOUNCEMENT = 'announcement',
  GENERAL = 'general',
  SYSTEM = 'system'
}

@Entity('in_app_notifications')
@Index(['recipientUserId', 'isRead'])
@Index(['type'])
export class InAppNotification {
  @ApiProperty({ description: 'Unique identifier for the notification' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Title of the notification' })
  @Column({ length: 200 })
  title: string;

  @ApiProperty({ description: 'Message content of the notification' })
  @Column({ type: 'text' })
  message: string;

  @ApiProperty({ description: 'Type of notification', enum: InAppNotificationType })
  @Column({
    type: 'enum',
    enum: InAppNotificationType,
    default: InAppNotificationType.GENERAL
  })
  type: InAppNotificationType;

  @ApiProperty({ description: 'Whether the notification has been read' })
  @Column({ default: false })
  isRead: boolean;

  @ApiProperty({ description: 'ID of the user who should receive this notification. Null for system-wide notifications' })
  @Column({ nullable: true })
  recipientUserId: number;

  @ApiProperty({ description: 'Whether the notification is archived' })
  @Column({ default: false })
  isArchived: boolean;

  @ApiProperty({ description: 'When the notification was read' })
  @Column({ nullable: true })
  readAt: Date;

  @ApiProperty({ description: 'When the notification was archived' })
  @Column({ nullable: true })
  archivedAt: Date;

  @ApiProperty({ description: 'Date when the notification was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Date when the notification was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}