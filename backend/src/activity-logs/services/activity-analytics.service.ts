import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { ActivityLog } from "../entities/activity-log.entity"
import type { ActivityAction, ActivityCategory } from "../interfaces/activity-constants"

interface TimeSeriesPoint {
  date: string
  count: number
}

interface ActionDistribution {
  action: ActivityAction
  count: number
  percentage: number
}

interface CategoryDistribution {
  category: ActivityCategory
  count: number
  percentage: number
}

interface UserActivitySummary {
  userId: string
  totalActivities: number
  lastActivity: Date
  topActions: { action: ActivityAction; count: number }[]
}

@Injectable()
export class ActivityAnalyticsService {
  constructor(
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
  ) {}

  async getActivityTimeSeries(
    startDate: Date,
    endDate: Date,
    interval: "hour" | "day" | "week" | "month" = "day",
  ): Promise<TimeSeriesPoint[]> {
    const intervalFormat = this.getIntervalFormat(interval)

    const result = await this.activityLogRepository
      .createQueryBuilder("log")
      .select(`to_char(log.createdAt, '${intervalFormat}')`, "date")
      .addSelect("COUNT(*)", "count")
      .where("log.createdAt BETWEEN :startDate AND :endDate", { startDate, endDate })
      .groupBy(`to_char(log.createdAt, '${intervalFormat}')`)
      .orderBy("date", "ASC")
      .getRawMany()

    return result.map((item) => ({
      date: item.date,
      count: Number.parseInt(item.count, 10),
    }))
  }

  async getActionDistribution(startDate: Date, endDate: Date): Promise<ActionDistribution[]> {
    const result = await this.activityLogRepository
      .createQueryBuilder("log")
      .select("log.action", "action")
      .addSelect("COUNT(*)", "count")
      .where("log.createdAt BETWEEN :startDate AND :endDate", { startDate, endDate })
      .groupBy("log.action")
      .orderBy("count", "DESC")
      .getRawMany()

    const total = result.reduce((sum, item) => sum + Number.parseInt(item.count, 10), 0)

    return result.map((item) => ({
      action: item.action as ActivityAction,
      count: Number.parseInt(item.count, 10),
      percentage: (Number.parseInt(item.count, 10) / total) * 100,
    }))
  }

  async getCategoryDistribution(startDate: Date, endDate: Date): Promise<CategoryDistribution[]> {
    const result = await this.activityLogRepository
      .createQueryBuilder("log")
      .select("log.category", "category")
      .addSelect("COUNT(*)", "count")
      .where("log.createdAt BETWEEN :startDate AND :endDate", { startDate, endDate })
      .groupBy("log.category")
      .orderBy("count", "DESC")
      .getRawMany()

    const total = result.reduce((sum, item) => sum + Number.parseInt(item.count, 10), 0)

    return result.map((item) => ({
      category: item.category as ActivityCategory,
      count: Number.parseInt(item.count, 10),
      percentage: (Number.parseInt(item.count, 10) / total) * 100,
    }))
  }

  async getMostActiveUsers(startDate: Date, endDate: Date, limit = 10): Promise<UserActivitySummary[]> {
    // Get users with most activities
    const activeUsers = await this.activityLogRepository
      .createQueryBuilder("log")
      .select("log.userId", "userId")
      .addSelect("COUNT(*)", "totalActivities")
      .addSelect("MAX(log.createdAt)", "lastActivity")
      .where("log.createdAt BETWEEN :startDate AND :endDate", { startDate, endDate })
      .andWhere("log.userId IS NOT NULL")
      .groupBy("log.userId")
      .orderBy("totalActivities", "DESC")
      .limit(limit)
      .getRawMany()

    // For each user, get their top actions
    const userSummaries: UserActivitySummary[] = []

    for (const user of activeUsers) {
      const topActions = await this.activityLogRepository
        .createQueryBuilder("log")
        .select("log.action", "action")
        .addSelect("COUNT(*)", "count")
        .where("log.userId = :userId", { userId: user.userId })
        .andWhere("log.createdAt BETWEEN :startDate AND :endDate", { startDate, endDate })
        .groupBy("log.action")
        .orderBy("count", "DESC")
        .limit(5)
        .getRawMany()

      userSummaries.push({
        userId: user.userId,
        totalActivities: Number.parseInt(user.totalActivities, 10),
        lastActivity: new Date(user.lastActivity),
        topActions: topActions.map((action) => ({
          action: action.action as ActivityAction,
          count: Number.parseInt(action.count, 10),
        })),
      })
    }

    return userSummaries
  }

  async getAnomalousActivities(
    startDate: Date,
    endDate: Date,
    threshold = 2.0, // Standard deviations from mean
  ): Promise<ActivityLog[]> {
    // First, calculate the average number of activities per user
    const userActivityStats = await this.activityLogRepository
      .createQueryBuilder("log")
      .select("COUNT(*)", "count")
      .where("log.createdAt BETWEEN :startDate AND :endDate", { startDate, endDate })
      .andWhere("log.userId IS NOT NULL")
      .groupBy("log.userId")
      .getRawMany()

    const counts = userActivityStats.map((stat) => Number.parseInt(stat.count, 10))
    const mean = counts.reduce((sum, count) => sum + count, 0) / counts.length
    const variance = counts.reduce((sum, count) => sum + Math.pow(count - mean, 2), 0) / counts.length
    const stdDev = Math.sqrt(variance)

    const anomalyThreshold = mean + threshold * stdDev

    // Find users with activity counts above the threshold
    const anomalousUsers = await this.activityLogRepository
      .createQueryBuilder("log")
      .select("log.userId", "userId")
      .addSelect("COUNT(*)", "count")
      .where("log.createdAt BETWEEN :startDate AND :endDate", { startDate, endDate })
      .andWhere("log.userId IS NOT NULL")
      .groupBy("log.userId")
      .having("COUNT(*) > :threshold", { threshold: anomalyThreshold })
      .getRawMany()

    if (anomalousUsers.length === 0) {
      return []
    }

    // Get the actual logs for these users
    const userIds = anomalousUsers.map((user) => user.userId)

    return this.activityLogRepository.find({
      where: {
        userId: { $in: userIds } as any,
        createdAt: { $gte: startDate, $lte: endDate } as any,
      },
      order: {
        createdAt: "DESC",
      },
    })
  }

  private getIntervalFormat(interval: "hour" | "day" | "week" | "month"): string {
    switch (interval) {
      case "hour":
        return "YYYY-MM-DD HH24"
      case "day":
        return "YYYY-MM-DD"
      case "week":
        return "YYYY-WW"
      case "month":
        return "YYYY-MM"
      default:
        return "YYYY-MM-DD"
    }
  }
}

