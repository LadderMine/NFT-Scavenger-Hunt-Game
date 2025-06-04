import { Injectable, Logger, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Notification, NotificationStatus } from "../entities/notification.entity"
import type { GameEvent } from "../entities/game-event.entity"
import type { NotificationQueryDto } from "../dto/notification-query.dto"
import type { UpdateNotificationDto } from "../dto/update-notification.dto"
import type { NotificationGateway } from "../gateways/notification.gateway"

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private notificationGateway: NotificationGateway,
  ) {}

  async createNotificationFromGameEvent(gameEvent: GameEvent): Promise<Notification> {
    const notification = this.notificationRepository.create({
      title: gameEvent.title,
      message: gameEvent.description,
      userId: gameEvent.userId,
      gameEventId: gameEvent.id,
      data: {
        eventType: gameEvent.eventType,
        priority: gameEvent.priority,
        metadata: gameEvent.metadata,
      },
    })

    const savedNotification = await this.notificationRepository.save(notification)

    this.logger.log(`Notification created: ${savedNotification.id} for user: ${gameEvent.userId}`)

    // Send real-time notification
    await this.notificationGateway.sendNotificationToUser(gameEvent.userId, savedNotification)

    return savedNotification
  }

  async getNotifications(query: NotificationQueryDto): Promise<{ notifications: Notification[]; total: number }> {
    const queryBuilder = this.notificationRepository
      .createQueryBuilder("notification")
      .leftJoinAndSelect("notification.gameEvent", "gameEvent")
      .orderBy("notification.createdAt", "DESC")

    if (query.userId) {
      queryBuilder.andWhere("notification.userId = :userId", { userId: query.userId })
    }

    if (query.status) {
      queryBuilder.andWhere("notification.status = :status", { status: query.status })
    }

    const total = await queryBuilder.getCount()

    const notifications = await queryBuilder.skip(query.offset).take(query.limit).getMany()

    return { notifications, total }
  }

  async getNotificationById(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ["gameEvent"],
    })

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`)
    }

    return notification
  }

  async updateNotification(id: string, updateDto: UpdateNotificationDto): Promise<Notification> {
    const notification = await this.getNotificationById(id)

    if (updateDto.status === NotificationStatus.READ && !notification.readAt) {
      notification.readAt = new Date()
    }

    Object.assign(notification, updateDto)

    const updatedNotification = await this.notificationRepository.save(notification)

    this.logger.log(`Notification updated: ${id} - Status: ${updateDto.status}`)

    return updatedNotification
  }

  async markAsRead(id: string): Promise<Notification> {
    return this.updateNotification(id, { status: NotificationStatus.READ })
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, status: NotificationStatus.UNREAD },
      { status: NotificationStatus.READ, readAt: new Date() },
    )

    this.logger.log(`All notifications marked as read for user: ${userId}`)
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, status: NotificationStatus.UNREAD },
    })
  }

  async deleteNotification(id: string): Promise<void> {
    const result = await this.notificationRepository.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException(`Notification with ID ${id} not found`)
    }

    this.logger.log(`Notification deleted: ${id}`)
  }

  async cleanupOldNotifications(daysOld = 30): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const result = await this.notificationRepository.delete({
      createdAt: { $lt: cutoffDate } as any,
      status: NotificationStatus.READ,
    })

    this.logger.log(`Cleaned up ${result.affected} old notifications`)
    return result.affected || 0
  }
}
