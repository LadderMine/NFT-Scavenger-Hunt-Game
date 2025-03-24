import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Notification } from "./entities/notification.entity"

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: string,
    metadata?: any,
  ): Promise<Notification> {
    const notification = this.notificationsRepository.create({
      userId,
      title,
      message,
      type,
      metadata,
      isRead: false,
    })

    return this.notificationsRepository.save(notification)
  }

  async sendBoosterPurchaseNotification(userId: string, boosterName: string, quantity: number): Promise<Notification> {
    return this.createNotification(
      userId,
      "Booster Purchased",
      `You have purchased ${quantity} ${boosterName} booster${quantity > 1 ? "s" : ""}.`,
      "booster_purchase",
      { boosterName, quantity },
    )
  }

  async sendBundlePurchaseNotification(userId: string, bundleName: string, quantity: number): Promise<Notification> {
    return this.createNotification(
      userId,
      "Bundle Purchased",
      `You have purchased the ${bundleName} bundle with ${quantity} boosters.`,
      "bundle_purchase",
      { bundleName, quantity },
    )
  }

  async sendBoosterGiftNotification(
    userId: string,
    senderId: string,
    boosterName: string,
    quantity: number,
  ): Promise<Notification> {
    return this.createNotification(
      userId,
      "Booster Gift Received",
      `You have received ${quantity} ${boosterName} booster${quantity > 1 ? "s" : ""} as a gift.`,
      "booster_gift",
      { senderId, boosterName, quantity },
    )
  }

  async sendGiftResponseNotification(
    userId: string,
    recipientId: string,
    boosterName: string,
    quantity: number,
    accepted: boolean,
  ): Promise<Notification> {
    return this.createNotification(
      userId,
      accepted ? "Gift Accepted" : "Gift Declined",
      accepted
        ? `Your gift of ${quantity} ${boosterName} booster${quantity > 1 ? "s" : ""} was accepted.`
        : `Your gift of ${quantity} ${boosterName} booster${quantity > 1 ? "s" : ""} was declined and returned to your inventory.`,
      "gift_response",
      { recipientId, boosterName, quantity, accepted },
    )
  }

  async sendAchievementCompletedNotification(userId: string, achievementName: string): Promise<Notification> {
    return this.createNotification(
      userId,
      "Achievement Completed",
      `Congratulations! You have completed the "${achievementName}" achievement.`,
      "achievement_completed",
      { achievementName },
    )
  }

  async sendBoosterExpirationNotification(
    userId: string,
    boosterName: string,
    daysLeft: number,
  ): Promise<Notification> {
    return this.createNotification(
      userId,
      "Booster Expiring Soon",
      `Your ${boosterName} boosters will expire in ${daysLeft} day${daysLeft > 1 ? "s" : ""}.`,
      "booster_expiration",
      { boosterName, daysLeft },
    )
  }

  async getUserNotifications(userId: string, limit = 20, offset = 0): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
      take: limit,
      skip: offset,
    })
  }

  async markNotificationAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id, userId },
    })

    if (!notification) {
      throw new Error("Notification not found")
    }

    notification.isRead = true
    notification.readAt = new Date()

    return this.notificationsRepository.save(notification)
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await this.notificationsRepository.update({ userId, isRead: false }, { isRead: true, readAt: new Date() })
  }
}

