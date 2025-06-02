import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { InAppNotification } from "./entities/in-app-notification.entity";
import { InAppNotificationsController } from "./in-app-notifications.controller";
import { InAppNotificationsService } from "./in-app-notifications.service";
import { InAppNotificationsGateway } from "./in-app-notifications.gateway";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([InAppNotification]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    UsersModule,
  ],
  controllers: [InAppNotificationsController],
  providers: [InAppNotificationsService, InAppNotificationsGateway],
  exports: [InAppNotificationsService],
})
export class InAppNotificationsModule {}
