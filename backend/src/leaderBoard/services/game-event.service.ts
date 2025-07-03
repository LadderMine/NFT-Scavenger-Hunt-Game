import { Injectable } from "@nestjs/common"
import type { LeaderboardService } from "./leaderboard.service"
import type { AchievementService } from "./achievement.service"

@Injectable()
export class GameEventService {
  constructor(
    private readonly leaderboardService: LeaderboardService,
    private readonly achievementService: AchievementService,
  ) {}

  async handlePuzzleCompleted(userId: string, username: string, score: number, country?: string): Promise<void> {
    // Update leaderboard
    await this.leaderboardService.updateUserScore(userId, username, score, country)

    // Update daily streak
    await this.leaderboardService.updateDailyStreak(userId)

    // Check and award achievements
    await this.achievementService.checkAndAwardAchievements(userId)
  }

  async handleUserLogin(userId: string): Promise<void> {
    // Update daily streak on login
    await this.leaderboardService.updateDailyStreak(userId)

    // Check streak-based achievements
    await this.achievementService.checkAndAwardAchievements(userId)
  }
}
