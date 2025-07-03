import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Streak } from "./entities/streak.entity"
import { StreakActivity } from "./entities/streak-activity.entity"
import { StreakCalculationService } from "./services/streak-calculation.service"
import { StreakService } from "./services/streak.service"
import { StreakController } from "./controllers/streak.controller"
import { PublicStreakController } from "./controllers/public-streak.controller"

@Module({
  imports: [TypeOrmModule.forFeature([Streak, StreakActivity])],
  controllers: [StreakController, PublicStreakController],
  providers: [StreakCalculationService, StreakService],
  exports: [StreakService, StreakCalculationService],
})
export class StreakModule {}
