import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { NotificationSettingsService } from './notification-settings.service';
import { NotificationSettingsDto } from './dto/create-notification-setting.dto';
import { NotificationSettings } from './entities/notification-setting.entity';

@Controller('notification-settings')
export class NotificationSettingsController {
  constructor(
    private readonly notificationSettingsService: NotificationSettingsService,
  ) {}

  @Post(':userId')
  async createOrUpdateNotificationSettings(
    @Param('userId') userId: string,
    @Body() settings: NotificationSettingsDto,
  ) {
    return this.notificationSettingsService.createOrUpdateNotificationSettings(
      userId,
      settings,
    );
  }

  @Get(':userId')
  async getNotificationSettings(
    @Param('userId') userId: string,
  ): Promise<NotificationSettings> {
    return this.notificationSettingsService.getNotificationSettings(userId);
  }
}
