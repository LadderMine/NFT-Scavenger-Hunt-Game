import { Controller, Get, Query, DefaultValuePipe, ParseIntPipe } from "@nestjs/common"
import type { StreakService } from "../services/streak.service"
import type { StreakCalculationConfig } from "../services/streak-calculation.service"

@Controller("public/streaks")
export class PublicStreakController {
  constructor(private readonly streakService: StreakService) {}

  @Get("user/:userId")
  async getPublicUserStreak(
    userId: string,
    @Query("timezoneOffset", new DefaultValuePipe(0), ParseIntPipe) timezoneOffset: number,
  ) {
    const config: Partial<StreakCalculationConfig> = {
      timezoneOffset,
      gracePeriodHours: 6,
      resetAfterDays: 2,
    }

    const stats = await this.streakService.getStreakStats(userId, config)

    // Return only public information
    return {
      userId: stats.userId,
      currentStreak: stats.currentStreak,
      longestStreak: stats.longestStreak,
      isActive: stats.isActive,
      totalActiveDays: stats.totalActiveDays,
    }
  }

  @Get("leaderboard")
  async getPublicLeaderboard(
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.streakService.getLeaderboard(Math.min(limit, 100)) // Cap at 100
  }

  @Get("user/:userId/history")
  async getPublicUserStreakHistory(
    userId: string,
    @Query("days", new DefaultValuePipe(30), ParseIntPipe) days: number,
  ) {
    const history = await this.streakService.getStreakHistory(
      userId,
      Math.min(days, 90), // Cap at 90 days for public API
    )

    // Return simplified history for public consumption
    return history.map((entry) => ({
      date: entry.date,
      hasActivity: entry.activityCount > 0,
      streakDay: entry.streakDay,
    }))
  }

  @Get("stats")
  async getGlobalStats() {
    const activeStreaks = await this.streakService.getAllActiveStreaks()

    const totalActiveUsers = activeStreaks.length
    const averageStreak =
      totalActiveUsers > 0 ? activeStreaks.reduce((sum, streak) => sum + streak.currentStreak, 0) / totalActiveUsers : 0
    const longestCurrentStreak = Math.max(...activeStreaks.map((s) => s.currentStreak), 0)
    const longestAllTimeStreak = Math.max(...activeStreaks.map((s) => s.longestStreak), 0)

    return {
      totalActiveUsers,
      averageStreak: Math.round(averageStreak * 100) / 100,
      longestCurrentStreak,
      longestAllTimeStreak,
    }
  }
}
