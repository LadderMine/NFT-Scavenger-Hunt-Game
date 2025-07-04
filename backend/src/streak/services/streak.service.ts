import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import { Streak } from "../entities/streak.entity"
import type { StreakActivity, ActivityType } from "../entities/streak-activity.entity"
import type { StreakCalculationService, StreakCalculationConfig } from "./streak-calculation.service"
import type { RecordActivityDto } from "../dto/record-activity.dto"
import type { StreakStatsDto, StreakLeaderboardDto, StreakHistoryDto } from "../dto/streak-stats.dto"

@Injectable()
export class StreakService {
  private readonly streakRepository: Repository<Streak>
  private readonly activityRepository: Repository<StreakActivity>
  private readonly calculationService: StreakCalculationService

  constructor(
    streakRepository: Repository<Streak>,
    activityRepository: Repository<StreakActivity>,
    calculationService: StreakCalculationService,
  ) {
    this.streakRepository = streakRepository
    this.activityRepository = activityRepository
    this.calculationService = calculationService
  }

  async recordActivity(
    userId: string,
    recordDto: RecordActivityDto,
    config: Partial<StreakCalculationConfig> = {},
  ): Promise<Streak> {
    const activityDate = recordDto.activityDate ? new Date(recordDto.activityDate) : new Date()

    // Normalize to date only (remove time)
    const normalizedDate = new Date(activityDate.toDateString())

    // Get or create streak record
    let streak = await this.streakRepository.findOne({
      where: { userId },
    })

    if (!streak) {
      streak = this.streakRepository.create({
        userId,
        currentStreak: 0,
        longestStreak: 0,
        totalActiveDays: 0,
        isActive: true,
      })
      streak = await this.streakRepository.save(streak)
    }

    // Check if activity already recorded for this date and type
    const existingActivity = await this.activityRepository.findOne({
      where: {
        streakId: streak.id,
        userId,
        activityDate: normalizedDate,
        activityType: recordDto.activityType,
      },
    })

    if (existingActivity) {
      // Update existing activity count
      existingActivity.activityCount += recordDto.activityCount || 1
      existingActivity.description = recordDto.description || existingActivity.description
      existingActivity.metadata = recordDto.metadata ? JSON.stringify(recordDto.metadata) : existingActivity.metadata
      await this.activityRepository.save(existingActivity)
    } else {
      // Create new activity record
      const activity = this.activityRepository.create({
        streakId: streak.id,
        userId,
        activityDate: normalizedDate,
        activityType: recordDto.activityType,
        activityCount: recordDto.activityCount || 1,
        description: recordDto.description,
        metadata: recordDto.metadata ? JSON.stringify(recordDto.metadata) : null,
      })
      await this.activityRepository.save(activity)
    }

    // Recalculate streak
    return this.recalculateStreak(userId, config)
  }

  async recalculateStreak(userId: string, config: Partial<StreakCalculationConfig> = {}): Promise<Streak> {
    const streak = await this.streakRepository.findOne({
      where: { userId },
    })

    if (!streak) {
      throw new NotFoundException("Streak not found for user")
    }

    // Get all activity dates for this user
    const activities = await this.activityRepository
      .createQueryBuilder("activity")
      .select("DISTINCT activity.activityDate", "activityDate")
      .where("activity.userId = :userId", { userId })
      .orderBy("activity.activityDate", "DESC")
      .getRawMany()

    const activityDates = activities.map((a) => new Date(a.activityDate))

    // Calculate streak using the calculation service
    const calculation = this.calculationService.calculateStreakForDates(activityDates, config)

    // Update streak record
    const wasActive = streak.isActive
    streak.currentStreak = calculation.shouldReset ? 0 : calculation.currentStreak
    streak.longestStreak = Math.max(streak.longestStreak, calculation.longestStreak)
    streak.lastActivityDate = activityDates.length > 0 ? activityDates[0] : null
    streak.streakStartDate = calculation.streakStartDate
    streak.totalActiveDays = activityDates.length
    streak.isActive = !calculation.shouldReset && calculation.currentStreak > 0

    if (calculation.shouldReset && wasActive) {
      streak.lastResetAt = new Date()
    }

    return this.streakRepository.save(streak)
  }

  async getStreakStats(userId: string, config: Partial<StreakCalculationConfig> = {}): Promise<StreakStatsDto> {
    let streak = await this.streakRepository.findOne({
      where: { userId },
    })

    if (!streak) {
      // Create initial streak record
      streak = await this.streakRepository.save(
        this.streakRepository.create({
          userId,
          currentStreak: 0,
          longestStreak: 0,
          totalActiveDays: 0,
          isActive: false,
        }),
      )
    }

    // Recalculate to ensure accuracy
    streak = await this.recalculateStreak(userId, config)

    const daysUntilReset = streak.lastActivityDate
      ? this.calculationService.getDaysUntilReset(streak.lastActivityDate, config)
      : 0

    return {
      userId: streak.userId,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      totalActiveDays: streak.totalActiveDays,
      lastActivityDate: streak.lastActivityDate,
      streakStartDate: streak.streakStartDate,
      isActive: streak.isActive,
      daysUntilReset,
    }
  }

  async getLeaderboard(limit = 10): Promise<StreakLeaderboardDto[]> {
    const streaks = await this.streakRepository
      .createQueryBuilder("streak")
      .where("streak.isActive = :isActive", { isActive: true })
      .orderBy("streak.currentStreak", "DESC")
      .addOrderBy("streak.longestStreak", "DESC")
      .limit(limit)
      .getMany()

    return streaks.map((streak, index) => ({
      userId: streak.userId,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      rank: index + 1,
      isActive: streak.isActive,
    }))
  }

  async getStreakHistory(userId: string, days = 30): Promise<StreakHistoryDto[]> {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const activities = await this.activityRepository
      .createQueryBuilder("activity")
      .where("activity.userId = :userId", { userId })
      .andWhere("activity.activityDate >= :startDate", { startDate })
      .andWhere("activity.activityDate <= :endDate", { endDate })
      .orderBy("activity.activityDate", "ASC")
      .getMany()

    // Group activities by date
    const groupedActivities = activities.reduce(
      (acc, activity) => {
        const dateKey = activity.activityDate.toDateString()
        if (!acc[dateKey]) {
          acc[dateKey] = {
            date: activity.activityDate,
            activityTypes: [],
            activityCount: 0,
          }
        }
        acc[dateKey].activityTypes.push(activity.activityType)
        acc[dateKey].activityCount += activity.activityCount
        return acc
      },
      {} as Record<string, { date: Date; activityTypes: ActivityType[]; activityCount: number }>,
    )

    // Calculate streak day for each date
    const streak = await this.streakRepository.findOne({ where: { userId } })
    const allActivityDates = Object.values(groupedActivities)
      .map((g) => g.date)
      .sort((a, b) => b.getTime() - a.getTime())

    return Object.values(groupedActivities)
      .map((group) => {
        const streakDay = this.calculateStreakDayForDate(group.date, allActivityDates, streak)
        return {
          date: group.date,
          activityTypes: [...new Set(group.activityTypes)], // Remove duplicates
          activityCount: group.activityCount,
          streakDay,
        }
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  private calculateStreakDayForDate(targetDate: Date, allActivityDates: Date[], streak: Streak | null): number {
    if (!streak || !streak.streakStartDate) return 0

    const streakStart = new Date(streak.streakStartDate)
    const daysDiff = Math.floor((targetDate.getTime() - streakStart.getTime()) / (1000 * 60 * 60 * 24))

    return daysDiff >= 0 ? daysDiff + 1 : 0
  }

  async resetStreak(userId: string): Promise<Streak> {
    const streak = await this.streakRepository.findOne({
      where: { userId },
    })

    if (!streak) {
      throw new NotFoundException("Streak not found for user")
    }

    streak.currentStreak = 0
    streak.isActive = false
    streak.lastResetAt = new Date()
    streak.streakStartDate = null

    return this.streakRepository.save(streak)
  }

  async getAllActiveStreaks(): Promise<Streak[]> {
    return this.streakRepository.find({
      where: { isActive: true },
      order: { currentStreak: "DESC" },
    })
  }

  async cleanupInactiveStreaks(daysInactive = 30): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysInactive)

    const result = await this.streakRepository
      .createQueryBuilder()
      .update(Streak)
      .set({
        isActive: false,
        currentStreak: 0,
        lastResetAt: new Date(),
      })
      .where("lastActivityDate < :cutoffDate", { cutoffDate })
      .andWhere("isActive = :isActive", { isActive: true })
      .execute()

    return result.affected || 0
  }
}
