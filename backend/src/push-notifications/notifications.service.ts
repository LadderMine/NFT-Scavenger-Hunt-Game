import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { type Repository, In, LessThan, MoreThan, Between, IsNull } from "typeorm"
import { Notification, NotificationType } from "./entities/notification.entity"
import type { CreateNotificationDto } from "./dto/create-notification.dto"
import type { NotificationsGateway } from "./notifications.gateway"
import type { PaginationDto } from "./dto/pagination.dto"
import type { SchedulerRegistry } from "@nestjs/schedule"
import { CronJob } from "cron"
import { v4 as uuidv4 } from "uuid"

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    private notificationsGateway: NotificationsGateway,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  /**
   * Create a new notification
   * @param createNotificationDto - The notification data
   * @returns The created notification
   */
  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationsRepository.create(createNotificationDto)
    const savedNotification = await this.notificationsRepository.save(notification)

    // Emit real-time notification via WebSocket
    if (savedNotification.userId) {
      this.notificationsGateway.sendNotificationToUser(savedNotification.userId, savedNotification)
    } else {
      // System-wide notification
      this.notificationsGateway.sendNotificationToAll(savedNotification)
    }

    return savedNotification
  }

  /**
   * Schedule a notification to be sent at a later time
   * @param createNotificationDto - The notification data
   * @param scheduledDate - When to send the notification
   * @returns The ID of the scheduled job
   */
  scheduleNotification(createNotificationDto: CreateNotificationDto, scheduledDate: Date): string {
    const jobId = uuidv4()

    const job = new CronJob(scheduledDate, async () => {
      await this.create(createNotificationDto)
      this.schedulerRegistry.deleteCronJob(jobId)
    })

    this.schedulerRegistry.addCronJob(jobId, job)
    job.start()

    return jobId
  }

  /**
   * Cancel a scheduled notification
   * @param jobId - The ID of the scheduled job
   */
  cancelScheduledNotification(jobId: string): void {
    try {
      this.schedulerRegistry.deleteCronJob(jobId)
    } catch (error) {
      throw new NotFoundException(`Scheduled notification with ID ${jobId} not found`)
    }
  }

  /**
   * Find all notifications for a specific user with pagination
   * @param userId - The user ID
   * @param paginationDto - Pagination parameters
   * @returns Paginated list of notifications
   */
  async findAllForUser(
    userId: string,
    paginationDto: PaginationDto = { page: 1, limit: 10 },
  ): Promise<{ notifications: Notification[]; total: number; pages: number }> {
    const { page, limit } = paginationDto
    const skip = (page - 1) * limit

    const [notifications, total] = await this.notificationsRepository.findAndCount({
      where: { userId },
      order: { createdAt: "DESC" },
      skip,
      take: limit,
    })

    return {
      notifications,
      total,
      pages: Math.ceil(total / limit),
    }
  }

  /**
   * Find notifications with filtering options
   * @param options - Filter options
   * @param paginationDto - Pagination parameters
   * @returns Filtered and paginated notifications
   */
  async findWithFilters(
    options: {
      userId?: string
      type?: NotificationType
      isRead?: boolean
      startDate?: Date
      endDate?: Date
      systemWide?: boolean
    },
    paginationDto: PaginationDto = { page: 1, limit: 10 },
  ): Promise<{ notifications: Notification[]; total: number; pages: number }> {
    const { page, limit } = paginationDto
    const skip = (page - 1) * limit

    const whereClause: any = {}

    if (options.userId) {
      whereClause.userId = options.userId
    }

    if (options.type) {
      whereClause.type = options.type
    }

    if (options.isRead !== undefined) {
      whereClause.isRead = options.isRead
    }

    if (options.startDate && options.endDate) {
      whereClause.createdAt = Between(options.startDate, options.endDate)
    } else if (options.startDate) {
      whereClause.createdAt = MoreThan(options.startDate)
    } else if (options.endDate) {
      whereClause.createdAt = LessThan(options.endDate)
    }

    if (options.systemWide) {
      whereClause.userId = IsNull()
    }

    const [notifications, total] = await this.notificationsRepository.findAndCount({
      where: whereClause,
      order: { createdAt: "DESC" },
      skip,
      take: limit,
    })

    return {
      notifications,
      total,
      pages: Math.ceil(total / limit),
    }
  }

  /**
   * Find a notification by ID
   * @param id - The notification ID
   * @returns The notification
   */
  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id },
    })

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`)
    }

    return notification
  }

  /**
   * Mark a notification as read
   * @param id - The notification ID
   * @returns The updated notification
   */
  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.findOne(id)
    notification.isRead = true
    return this.notificationsRepository.save(notification)
  }

  /**
   * Mark multiple notifications as read
   * @param ids - Array of notification IDs
   * @returns Number of notifications updated
   */
  async markMultipleAsRead(ids: string[]): Promise<number> {
    if (!ids.length) {
      throw new BadRequestException("No notification IDs provided")
    }

    const result = await this.notificationsRepository.update({ id: In(ids) }, { isRead: true })

    return result.affected || 0
  }

  /**
   * Mark all notifications as read for a user
   * @param userId - The user ID
   * @returns Number of notifications updated
   */
  async markAllAsReadForUser(userId: string): Promise<number> {
    const result = await this.notificationsRepository.update({ userId, isRead: false }, { isRead: true })

    return result.affected || 0
  }

  /**
   * Count unread notifications for a user
   * @param userId - The user ID
   * @returns Number of unread notifications
   */
  async countUnreadForUser(userId: string): Promise<number> {
    return this.notificationsRepository.count({
      where: { userId, isRead: false },
    })
  }

  /**
   * Delete a notification
   * @param id - The notification ID
   * @returns Boolean indicating success
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.notificationsRepository.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException(`Notification with ID ${id} not found`)
    }

    return true
  }

  /**
   * Delete multiple notifications
   * @param ids - Array of notification IDs
   * @returns Number of notifications deleted
   */
  async deleteMultiple(ids: string[]): Promise<number> {
    if (!ids.length) {
      throw new BadRequestException("No notification IDs provided")
    }

    const result = await this.notificationsRepository.delete({ id: In(ids) })
    return result.affected || 0
  }

  /**
   * Delete all notifications for a user
   * @param userId - The user ID
   * @returns Number of notifications deleted
   */
  async deleteAllForUser(userId: string): Promise<number> {
    const result = await this.notificationsRepository.delete({ userId })
    return result.affected || 0
  }

  /**
   * Delete old notifications based on age
   * @param olderThan - Date threshold
   * @returns Number of notifications deleted
   */
  async deleteOldNotifications(olderThan: Date): Promise<number> {
    const result = await this.notificationsRepository.delete({
      createdAt: LessThan(olderThan),
    })

    return result.affected || 0
  }

  /**
   * Create a system-wide notification (sent to all users)
   * @param title - Notification title
   * @param message - Notification message
   * @param type - Notification type
   * @returns The created notification
   */
  async createSystemNotification(
    title: string,
    message: string,
    type: NotificationType = NotificationType.INFO,
  ): Promise<Notification> {
    return this.create({
      title,
      message,
      type,
      userId: null, // null userId indicates system-wide notification
    })
  }

  /**
   * Create notifications for multiple users
   * @param userIds - Array of user IDs
   * @param title - Notification title
   * @param message - Notification message
   * @param type - Notification type
   * @returns Array of created notifications
   */
  async createNotificationForMultipleUsers(
    userIds: string[],
    title: string,
    message: string,
    type: NotificationType = NotificationType.INFO,
  ): Promise<Notification[]> {
    const notifications = userIds.map((userId) =>
      this.notificationsRepository.create({
        userId,
        title,
        message,
        type,
      }),
    )

    const savedNotifications = await this.notificationsRepository.save(notifications)

    // Send real-time notifications
    savedNotifications.forEach((notification) => {
      if (notification.userId) {
        this.notificationsGateway.sendNotificationToUser(notification.userId, notification)
      }
    })

    return savedNotifications
  }

  /**
   * Create a notification from a template
   * @param templateKey - Template identifier
   * @param userId - User ID
   * @param params - Template parameters
   * @returns The created notification
   */
  async createFromTemplate(
    templateKey: string,
    userId: string | null,
    params: Record<string, any> = {},
  ): Promise<Notification> {
    // This is a simple template system - in a real app, you might store templates in the database
    const templates = {
      welcome: {
        title: "Welcome to our platform!",
        message: `Hello ${params.name || "there"}, welcome to our platform. We're glad to have you!`,
        type: NotificationType.SUCCESS,
      },
      password_reset: {
        title: "Password Reset Requested",
        message: `A password reset was requested for your account. If this wasn't you, please contact support.`,
        type: NotificationType.WARNING,
      },
      new_message: {
        title: "New Message Received",
        message: `You have a new message from ${params.sender || "someone"}: "${params.message || ""}"`,
        type: NotificationType.INFO,
      },
      account_locked: {
        title: "Account Temporarily Locked",
        message: "Your account has been temporarily locked due to multiple failed login attempts.",
        type: NotificationType.ERROR,
      },
    }

    const template = templates[templateKey]
    if (!template) {
      throw new NotFoundException(`Template with key ${templateKey} not found`)
    }

    return this.create({
      userId,
      ...template,
    })
  }
}

