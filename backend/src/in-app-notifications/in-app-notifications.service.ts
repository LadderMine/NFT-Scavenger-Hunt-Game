import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InAppNotification, InAppNotificationType } from './entities/in-app-notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { SystemNotificationDto } from './dto/system-notification.dto';
import { MarkReadDto } from './dto/mark-read.dto';
import { BroadcasterService } from './services/broadcaster.service';

@Injectable()
export class InAppNotificationsService {
  constructor(
    @InjectRepository(InAppNotification)
    private notificationRepository: Repository<InAppNotification>,
    private broadcasterService: BroadcasterService,
  ) {}

  /**
   * Get all notifications for a specific user
   */
  async getUserNotifications(userId: number, type?: InAppNotificationType): Promise<InAppNotification[]> {
    const queryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .where('(notification.recipientUserId = :userId OR notification.recipientUserId IS NULL)', { userId })
      .andWhere('notification.isArchived = :isArchived', { isArchived: false })
      .orderBy('notification.createdAt', 'DESC');

    if (type) {
      queryBuilder.andWhere('notification.type = :type', { type });
    }

    return queryBuilder.getMany();
  }

  /**
   * Get count of unread notifications for a user
   */
  async getUnreadCount(userId: number): Promise<number> {
    return this.notificationRepository.count({
      where: [
        { recipientUserId: userId, isRead: false, isArchived: false },
        { recipientUserId: null, isRead: false, isArchived: false } // System-wide notifications
      ]
    });
  }

  /**
   * Create a new notification for a specific user
   */
  async createNotification(createNotificationDto: CreateNotificationDto): Promise<InAppNotification> {
    if (createNotificationDto.userId) {
      return this.broadcasterService.sendToUser(createNotificationDto.userId, {
        title: createNotificationDto.title,
        message: createNotificationDto.message,
        type: createNotificationDto.type,
      });
    } else {
      // If no userId provided, create as system notification
      const notifications = await this.broadcasterService.broadcastToAllUsers({
        title: createNotificationDto.title,
        message: createNotificationDto.message,
        type: createNotificationDto.type,
      });
      return notifications[0];
    }
  }

  /**
   * Create a system-wide notification
   */
  async createSystemNotification(systemNotificationDto: SystemNotificationDto): Promise<InAppNotification[]> {
    return this.broadcasterService.broadcastToAllUsers(systemNotificationDto);
  }

  /**
   * Mark specific notifications as read
   */
  async markAsRead(userId: number, markReadDto: MarkReadDto): Promise<{ success: boolean; readAt: Date }> {
    const readAt = new Date();
    
    await this.notificationRepository
      .createQueryBuilder()
      .update(InAppNotification)
      .set({ isRead: true, readAt })
      .where('id IN (:...ids)', { ids: markReadDto.notificationIds })
      .andWhere('(recipientUserId = :userId OR recipientUserId IS NULL)', { userId })
      .execute();

    return { success: true, readAt };
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: number): Promise<{ success: boolean; readAt: Date }> {
    const readAt = new Date();
    
    await this.notificationRepository
      .createQueryBuilder()
      .update(InAppNotification)
      .set({ isRead: true, readAt })
      .where('(recipientUserId = :userId OR recipientUserId IS NULL)', { userId })
      .andWhere('isRead = :isRead', { isRead: false })
      .execute();

    return { success: true, readAt };
  }

  /**
   * Archive specific notifications
   */
  async archiveNotifications(userId: number, notificationIds: number[]): Promise<{ success: boolean; archivedAt: Date }> {
    const archivedAt = new Date();
    
    await this.notificationRepository
      .createQueryBuilder()
      .update(InAppNotification)
      .set({ isArchived: true, archivedAt })
      .where('id IN (:...ids)', { ids: notificationIds })
      .andWhere('(recipientUserId = :userId OR recipientUserId IS NULL)', { userId })
      .execute();

    return { success: true, archivedAt };
  }

  /**
   * Delete a notification
   */
  async deleteNotification(userId: number, notificationId: number): Promise<InAppNotification> {
    const notification = await this.notificationRepository.findOne({
      where: [
        { id: notificationId, recipientUserId: userId },
        { id: notificationId, recipientUserId: null } // System notifications
      ]
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${notificationId} not found`);
    }

    await this.notificationRepository.remove(notification);
    return { ...notification, id: notificationId };
  }

  /**
   * Get broadcaster service for external use
   */
  getBroadcaster(): BroadcasterService {
    return this.broadcasterService;
  }
}