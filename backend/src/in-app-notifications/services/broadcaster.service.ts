import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InAppNotification, InAppNotificationType } from '../entities/in-app-notification.entity';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { SystemNotificationDto } from '../dto/system-notification.dto';

@Injectable()
export class BroadcasterService {
  constructor(
    @InjectRepository(InAppNotification)
    private notificationRepository: Repository<InAppNotification>,
  ) {}

  /**
   * Send notification to a specific user
   */
  async sendToUser(userId: number, notificationData: Omit<CreateNotificationDto, 'userId'>): Promise<InAppNotification> {
    const notification = this.notificationRepository.create({
      ...notificationData,
      recipientUserId: userId,
    });
    return this.notificationRepository.save(notification);
  }

  /**
   * Send notification to all users (system-wide broadcast)
   * This creates notifications for all existing users
   */
  async broadcastToAllUsers(notificationData: SystemNotificationDto): Promise<InAppNotification[]> {
    // For system-wide notifications, we create a single notification with null recipientUserId
    // This represents a global notification that all users can see
    const systemNotification = this.notificationRepository.create({
      ...notificationData,
      recipientUserId: null, // null means it's for all users
    });
    
    const savedNotification = await this.notificationRepository.save(systemNotification);
    return [savedNotification];
  }

  /**
   * Send notification to multiple specific users
   */
  async sendToMultipleUsers(userIds: number[], notificationData: Omit<CreateNotificationDto, 'userId'>): Promise<InAppNotification[]> {
    const notifications = userIds.map(userId => 
      this.notificationRepository.create({
        ...notificationData,
        recipientUserId: userId,
      })
    );
    return this.notificationRepository.save(notifications);
  }

  /**
   * Send reward notification to a specific user
   */
  async sendRewardNotification(userId: number, title: string, message: string): Promise<InAppNotification> {
    return this.sendToUser(userId, {
      title,
      message,
      type: InAppNotificationType.REWARD,
    });
  }

  /**
   * Send puzzle notification to a specific user
   */
  async sendPuzzleNotification(userId: number, title: string, message: string): Promise<InAppNotification> {
    return this.sendToUser(userId, {
      title,
      message,
      type: InAppNotificationType.PUZZLE,
    });
  }

  /**
   * Send announcement to all users
   */
  async sendAnnouncement(title: string, message: string): Promise<InAppNotification[]> {
    return this.broadcastToAllUsers({
      title,
      message,
      type: InAppNotificationType.ANNOUNCEMENT,
    });
  }
}