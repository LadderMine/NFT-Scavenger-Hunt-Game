import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ScheduleModule } from "@nestjs/schedule"
import { BoostersService } from "./boosters.service"
import { BoostersController } from "./boosters.controller"
import { Booster } from "./entities/booster.entity"
import { PlayerBooster } from "./entities/player-booster.entity"
import { BoosterUsage } from "./entities/booster-usage.entity"
import { BoosterBundle } from "./entities/booster-bundle.entity"
import { BoosterGift } from "./entities/booster-gift.entity"
import { BoosterAchievement } from "./entities/booster-achievement.entity"
import { PlayerAchievement } from "./entities/player-achievement.entity"
import { UsersModule } from "../users/users.module"
import { NotificationsModule } from "../notifications/notifications.module"

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booster,
      PlayerBooster,
      BoosterUsage,
      BoosterBundle,
      BoosterGift,
      BoosterAchievement,
      PlayerAchievement,
    ]),
    ScheduleModule.forRoot(),
    UsersModule,
    NotificationsModule,
  ],
  controllers: [BoostersController],
  providers: [BoostersService],
  exports: [BoostersService],
})
export class BoostersModule {}

