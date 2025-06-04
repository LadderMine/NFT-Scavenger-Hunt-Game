import { Injectable, Logger } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import type { NotificationService } from "../services/notification.service"

@Injectable()
export class NotificationCleanupTask {
  private readonly logger = new Logger(NotificationCleanupTask.name)

  constructor(private readonly notificationService: NotificationService) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleCleanupOldNotifications() {
    this.logger.log("Starting cleanup of old notifications...")

    try {
      const deletedCount = await this.notificationService.cleanupOldNotifications(30)
      this.logger.log(`Cleanup completed. Deleted ${deletedCount} old notifications.`)
    } catch (error) {
      this.logger.error(`Cleanup failed: ${error.message}`)
    }
  }
}
