import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "./entities/user.entity"
import { GameEvent } from "./entities/game-event.entity"
import { Notification } from "./entities/notification.entity"
import { GameEventService } from "./services/game-event.service"
import { NotificationService } from "./services/notification.service"
import { GameEventController } from "./controllers/game-event.controller"
import { NotificationController } from "./controllers/notification.controller"
import { NotificationGateway } from "./gateways/notification.gateway"

@Module({
  imports: [TypeOrmModule.forFeature([User, GameEvent, Notification])],
  controllers: [GameEventController, NotificationController],
  providers: [GameEventService, NotificationService, NotificationGateway],
  exports: [GameEventService, NotificationService, NotificationGateway],
})
export class GameNotificationsModule {}
