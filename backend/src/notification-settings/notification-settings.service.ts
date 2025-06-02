import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationSettings } from './entities/notification-setting.entity';

@Injectable()
export class NotificationSettingsService {
  constructor(
    @InjectRepository(NotificationSettings)
    private notificationSettingsRepository: Repository<NotificationSettings>,
  ) {}

  // Create or Update Notification Settings
  async createOrUpdateNotificationSettings(
    userId: string,
    settings: Partial<NotificationSettings>,
  ) {
    let notificationSettings =
      await this.notificationSettingsRepository.findOne({ where: { userId } });

    if (!notificationSettings) {
      notificationSettings = this.notificationSettingsRepository.create({
        userId,
        ...settings,
      });
    } else {
      notificationSettings.emailNotifications =
        settings.emailNotifications ?? notificationSettings.emailNotifications;
      notificationSettings.smsNotifications =
        settings.smsNotifications ?? notificationSettings.smsNotifications;
      notificationSettings.pushNotifications =
        settings.pushNotifications ?? notificationSettings.pushNotifications;
    }

    return this.notificationSettingsRepository.save(notificationSettings);
  }

  // Get Notification Settings for a user
  async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    return this.notificationSettingsRepository.findOne({ where: { userId } });
  }
}
