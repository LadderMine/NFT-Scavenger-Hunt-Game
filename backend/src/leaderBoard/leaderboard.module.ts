import { Module, type OnModuleInit } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Achievement } from "./entities/achievement.entity"
import { UserAchievement } from "./entities/user-achievement.entity"
import { LeaderboardEntry } from "./entities/leaderboard-entry.entity"
import { LeaderboardService } from "./services/leaderboard.service"
import { AchievementService } from "./services/achievement.service"
import { LeaderboardController } from "./controllers/leaderboard.controller"
import { AchievementController } from "./controllers/achievement.controller"

@Module({
  imports: [TypeOrmModule.forFeature([Achievement, UserAchievement, LeaderboardEntry])],
  controllers: [LeaderboardController, AchievementController],
  providers: [LeaderboardService, AchievementService],
  exports: [LeaderboardService, AchievementService],
})
export class LeaderboardModule implements OnModuleInit {
  constructor(private readonly achievementService: AchievementService) {}

  async onModuleInit() {
    // Initialize default achievements when module starts
    await this.achievementService.initializeAchievements()
  }
}
