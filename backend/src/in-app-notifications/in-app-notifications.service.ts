import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InAppNotification, InAppNotificationType } from "./entities/in-app-notification.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual, In } from "typeorm";
import { UsersService } from "src/users/users.service";
import { CreateInAppNotificationDto, MarkAsReadDto, ArchiveNotificationsDto } from "./dto/create-in-app-notification.dto";
import { InAppNotificationsGateway } from "./in-app-notifications.gateway";

@Injectable()
export class InAppNotificationsService {
  constructor(
    @InjectRepository(InAppNotification)
    private readonly notificationsRepository: Repository<InAppNotification>,
    private readonly usersService: UsersService,
    private readonly notificationsGateway: InAppNotificationsGateway,
  ) {}

  async create(createDto: CreateInAppNotificationDto): Promise<InAppNotification> {
    try {
      // Verify user exists
      const user = await this.usersService.FindByUsername(createDto.userId.toString());
      if (!user) {
        throw new NotFoundException(`User with ID ${createDto.userId} not found`);
      }

      const notification = this.notificationsRepository.create({
        ...createDto,
        isRead: false,
        isArchived: false,
      });

      const savedNotification = await this.notificationsRepository.save(notification);

      // Send real-time notification
      this.notificationsGateway.sendNotification(createDto.userId, savedNotification);

      return savedNotification;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create notification: ${error.message}`);
    }
  }

  async getUserNotifications(
    userId: number,
    options: {
      isRead?: boolean;
      isArchived?: boolean;
      type?: InAppNotificationType;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<{ notifications: InAppNotification[]; total: number }> {
    try {
      const queryBuilder = this.notificationsRepository
        .createQueryBuilder('notification')
        .where('notification.userId = :userId', { userId });

      if (options.isRead !== undefined) {
        queryBuilder.andWhere('notification.isRead = :isRead', { isRead: options.isRead });
      }

      if (options.isArchived !== undefined) {
        queryBuilder.andWhere('notification.isArchived = :isArchived', { isArchived: options.isArchived });
      }

      if (options.type) {
        queryBuilder.andWhere('notification.type = :type', { type: options.type });
      }

      if (options.startDate && options.endDate) {
        queryBuilder.andWhere('notification.createdAt BETWEEN :startDate AND :endDate', {
          startDate: options.startDate,
          endDate: options.endDate,
        });
      }

      const total = await queryBuilder.getCount();

      if (options.limit) {
        queryBuilder.take(options.limit);
      }

      if (options.offset) {
        queryBuilder.skip(options.offset);
      }

      queryBuilder.orderBy('notification.createdAt', 'DESC');

      const notifications = await queryBuilder.getMany();

      return { notifications, total };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch notifications: ${error.message}`);
    }
  }

  async markAsRead(notificationIds: number[]): Promise<void> {
    try {
      await this.notificationsRepository.update(
        { id: In(notificationIds) },
        { isRead: true, readAt: new Date() },
      );
    } catch (error) {
      throw new BadRequestException(`Failed to mark notifications as read: ${error.message}`);
    }
  }

  async markAllAsRead(userId: number): Promise<void> {
    try {
      await this.notificationsRepository.update(
        { userId, isRead: false },
        { isRead: true, readAt: new Date() },
      );
    } catch (error) {
      throw new BadRequestException(`Failed to mark all notifications as read: ${error.message}`);
    }
  }

  async archiveNotifications(notificationIds: number[]): Promise<void> {
    try {
      await this.notificationsRepository.update(
        { id: In(notificationIds) },
        { isArchived: true, archivedAt: new Date() },
      );
    } catch (error) {
      throw new BadRequestException(`Failed to archive notifications: ${error.message}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const result = await this.notificationsRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete notification: ${error.message}`);
    }
  }

  async getUnreadCount(userId: number): Promise<number> {
    try {
      return await this.notificationsRepository.count({
        where: { userId, isRead: false },
      });
    } catch (error) {
      throw new BadRequestException(`Failed to get unread count: ${error.message}`);
    }
  }

  async createSystemNotification(notification: Omit<CreateInAppNotificationDto, 'userId'>): Promise<void> {
    try {
      // Get all users
      const users = await this.usersService.findAll();
      
      // Create notifications for all users
      const notifications = users.map(user => ({
        ...notification,
        userId: user.id,
      }));

      // Save notifications in batches
      const batchSize = 100;
      for (let i = 0; i < notifications.length; i += batchSize) {
        const batch = notifications.slice(i, i + batchSize);
        await this.notificationsRepository.save(batch);
      }

      // Broadcast system notification
      this.notificationsGateway.sendSystemNotification(notification as InAppNotification);
    } catch (error) {
      throw new BadRequestException(`Failed to create system notification: ${error.message}`);
    }
  }
}
