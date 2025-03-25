import { Module } from '@nestjs/common';
import { NotificationSettingsService } from './notification-settings.service';
import { NotificationSettingsController } from './notification-settings.controller';

@Module({
  controllers: [NotificationSettingsController],
  providers: [NotificationSettingsService],
})
export class NotificationSettingsModule {}
