import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common"
import type { StreakService } from "../services/streak.service"
import type { RecordActivityDto } from "../dto/record-activity.dto"
import type { StreakCalculationConfig } from "../services/streak-calculation.service"

@Controller("streaks")
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  @Post("activity")
  @HttpCode(HttpStatus.CREATED)
  async recordActivity(recordDto: RecordActivityDto) {
    // In a real app, you'd get userId from JWT token
    const req = { user: { id: "user-id-placeholder" } } // Mock request object
    const userId = req.user.id

    const config: Partial<StreakCalculationConfig> = {
      gracePeriodHours: 6,
      timezoneOffset: 0, // You might get this from user preferences
      resetAfterDays: 2,
    }

    return this.streakService.recordActivity(userId, recordDto, config)
  }

  @Get("user/:userId")
  async getUserStreak(
    @Param("userId") userId: string,
    @Query("timezoneOffset", new DefaultValuePipe(0), ParseIntPipe) timezoneOffset: number,
  ) {
    const config: Partial<StreakCalculationConfig> = {
      timezoneOffset,
      gracePeriodHours: 6,
      resetAfterDays: 2,
    }

    return this.streakService.getStreakStats(userId, config)
  }

  @Get("my-streak")
  async getMyStreak(
    @Query("timezoneOffset", new DefaultValuePipe(0), ParseIntPipe) timezoneOffset: number,
  ) {
    // In a real app, you'd get userId from JWT token
    const req = { user: { id: "user-id-placeholder" } } // Mock request object
    const userId = req.user.id

    const config: Partial<StreakCalculationConfig> = {
      timezoneOffset,
      gracePeriodHours: 6,
      resetAfterDays: 2,
    }

    return this.streakService.getStreakStats(userId, config)
  }

  @Get("leaderboard")
  async getLeaderboard(
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.streakService.getLeaderboard(limit)
  }

  @Get("history")
  async getMyStreakHistory(
    @Query("days", new DefaultValuePipe(30), ParseIntPipe) days: number,
  ) {
    // In a real app, you'd get userId from JWT token
    const req = { user: { id: "user-id-placeholder" } } // Mock request object
    const userId = req.user.id

    return this.streakService.getStreakHistory(userId, days)
  }

  @Get("user/:userId/history")
  async getUserStreakHistory(
    @Param("userId") userId: string,
    @Query("days", new DefaultValuePipe(30), ParseIntPipe) days: number,
  ) {
    return this.streakService.getStreakHistory(userId, days)
  }

  @Post("recalculate")
  @HttpCode(HttpStatus.OK)
  async recalculateMyStreak(
    @Query("timezoneOffset", new DefaultValuePipe(0), ParseIntPipe) timezoneOffset: number,
  ) {
    // In a real app, you'd get userId from JWT token
    const req = { user: { id: "user-id-placeholder" } } // Mock request object
    const userId = req.user.id

    const config: Partial<StreakCalculationConfig> = {
      timezoneOffset,
      gracePeriodHours: 6,
      resetAfterDays: 2,
    }

    return this.streakService.recalculateStreak(userId, config)
  }

  @Post("reset")
  @HttpCode(HttpStatus.OK)
  async resetMyStreak() {
    // In a real app, you'd get userId from JWT token
    const req = { user: { id: "user-id-placeholder" } } // Mock request object
    const userId = req.user.id

    return this.streakService.resetStreak(userId)
  }

  @Get("active")
  async getAllActiveStreaks() {
    return this.streakService.getAllActiveStreaks()
  }
}
