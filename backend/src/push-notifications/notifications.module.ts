import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ScheduleModule } from "@nestjs/schedule"
import { NotificationsController } from "./notifications.controller"
import { NotificationsService } from "./notifications.service"
import { NotificationsGateway } from "./notifications.gateway"
import { Notification } from "./entities/notification.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), ScheduleModule.forRoot()],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway],
  exports: [NotificationsService],
})
export class NotificationsModule {}

