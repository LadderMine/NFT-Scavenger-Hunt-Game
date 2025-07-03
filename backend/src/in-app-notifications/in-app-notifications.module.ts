import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InAppNotificationsController } from './in-app-notifications.controller';
import { InAppNotificationsService } from './in-app-notifications.service';
import { BroadcasterService } from './services/broadcaster.service';
import { InAppNotification } from './entities/in-app-notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InAppNotification]),
  ],
  controllers: [InAppNotificationsController],
  providers: [InAppNotificationsService, BroadcasterService],
  exports: [InAppNotificationsService, BroadcasterService],
})
export class InAppNotificationsModule {}