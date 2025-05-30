import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { UserEvent } from "../entities/user-event.entity"
import { CreateUserEventDto } from "../dto/create-user-event.dto"
import { EventType } from "aws-sdk/clients/budgets"
import { EventAnalyticsQueryDto } from "../dto/event-analytics.dto"
import { EventAnalyticsResponseDto, EventCountDto, TopUserDto, UserEventStatsDto } from "../dto/event-analytics-response.dto"

@Injectable()
export class UserEventsService {
  constructor(
    @InjectRepository(UserEvent)
    private userEventRepository: Repository<UserEvent>,
  ) { }

  async logEvent(createUserEventDto: CreateUserEventDto): Promise<UserEvent> {
    const event = this.userEventRepository.create({
      ...createUserEventDto,
      createdAt: new Date(),
    })

    return await this.userEventRepository.save(event)
  }

  async getEventById(id: string): Promise<UserEvent> {
    const event = await this.userEventRepository.findOne({
      where: { id },
      relations: ["user"],
    })

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`)
    }

    return event
  }

  async getUserEvents(
    userId: string,
    eventTypes?: EventType[],
    limit = 50,
    offset = 0,
  ): Promise<{ events: UserEvent[]; total: number }> {
    const queryBuilder = this.userEventRepository
      .createQueryBuilder("event")
      .where("event.userId = :userId", { userId })
      .orderBy("event.createdAt", "DESC")
      .skip(offset)
      .take(limit)

    if (eventTypes && eventTypes.length > 0) {
      queryBuilder.andWhere("event.eventType IN (:...eventTypes)", { eventTypes })
    }

    const [events, total] = await queryBuilder.getManyAndCount()

    return { events, total }
  }

  async getAnalytics(query: EventAnalyticsQueryDto): Promise<EventAnalyticsResponseDto> {
    const { eventTypes, userId, startDate, endDate, groupBy = "day", limit = 100, offset = 0 } = query

    // Build base query
    const queryBuilder = this.userEventRepository.createQueryBuilder("event")

    // Apply filters
    if (userId) {
      queryBuilder.andWhere("event.userId = :userId", { userId })
    }

    if (eventTypes && eventTypes.length > 0) {
      queryBuilder.andWhere("event.eventType IN (:...eventTypes)", { eventTypes })
    }

    if (startDate && endDate) {
      queryBuilder.andWhere("event.createdAt BETWEEN :startDate AND :endDate", {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      })
    }

    // Get basic stats
    const stats = await this.getBasicStats(queryBuilder.clone())

    // Get top users
    const topUsers = await this.getTopUsers(queryBuilder.clone(), limit)

    // Get time series data
    const timeSeriesData = await this.getTimeSeriesData(queryBuilder.clone(), groupBy)

    return {
      stats,
      topUsers,
      timeSeriesData,
    }
  }

  private async getBasicStats(queryBuilder: any): Promise<UserEventStatsDto> {
    // Total events
    const totalEvents = await queryBuilder.getCount()

    // Unique users
    const uniqueUsersResult = await queryBuilder.select("COUNT(DISTINCT event.userId)", "count").getRawOne()
    const uniqueUsers = Number.parseInt(uniqueUsersResult.count) || 0

    // Event counts by type
    const eventCountsResult = await this.userEventRepository
      .createQueryBuilder("event")
      .select("event.eventType", "eventType")
      .addSelect("COUNT(*)", "count")
      .groupBy("event.eventType")
      .orderBy("count", "DESC")
      .getRawMany()

    const eventCounts: EventCountDto[] = eventCountsResult.map((result) => ({
      eventType: result.eventType,
      count: Number.parseInt(result.count),
    }))

    // Get date range
    const dateRangeResult = await this.userEventRepository
      .createQueryBuilder("event")
      .select("MIN(event.createdAt)", "min")
      .addSelect("MAX(event.createdAt)", "max")
      .getRawOne()

    return {
      totalEvents,
      uniqueUsers,
      eventCounts,
      periodStart: dateRangeResult.min || new Date(),
      periodEnd: dateRangeResult.max || new Date(),
    }
  }

  private async getTopUsers(queryBuilder: any, limit: number): Promise<TopUserDto[]> {
    const topUsersResult = await queryBuilder
      .leftJoin("event.user", "user")
      .select("event.userId", "userId")
      .addSelect("user.username", "username")
      .addSelect("user.email", "email")
      .addSelect("COUNT(*)", "eventCount")
      .where("event.userId IS NOT NULL")
      .groupBy("event.userId")
      .addGroupBy("user.username")
      .addGroupBy("user.email")
      .orderBy("eventCount", "DESC")
      .limit(limit)
      .getRawMany()

    return topUsersResult.map((result) => ({
      userId: result.userId,
      username: result.username || "Unknown",
      email: result.email || "Unknown",
      eventCount: Number.parseInt(result.eventCount),
    }))
  }

  private async getTimeSeriesData(queryBuilder: any, groupBy: string): Promise<EventCountDto[]> {
    let dateFormat: string
    switch (groupBy) {
      case "hour":
        dateFormat = "YYYY-MM-DD HH24:00:00"
        break
      case "day":
        dateFormat = "YYYY-MM-DD"
        break
      case "week":
        dateFormat = 'YYYY-"W"WW'
        break
      case "month":
        dateFormat = "YYYY-MM"
        break
      default:
        dateFormat = "YYYY-MM-DD"
    }

    const timeSeriesResult = await queryBuilder
      .select(`TO_CHAR(event.createdAt, '${dateFormat}')`, "date")
      .addSelect("event.eventType", "eventType")
      .addSelect("COUNT(*)", "count")
      .groupBy("date")
      .addGroupBy("event.eventType")
      .orderBy("date", "ASC")
      .getRawMany()

    return timeSeriesResult.map((result) => ({
      eventType: result.eventType,
      count: Number.parseInt(result.count),
      date: result.date,
    }))
  }

  async getEventsByDateRange(startDate: Date, endDate: Date, eventTypes?: EventType[]): Promise<UserEvent[]> {
    const queryBuilder = this.userEventRepository
      .createQueryBuilder("event")
      .where("event.createdAt BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .orderBy("event.createdAt", "DESC")

    if (eventTypes && eventTypes.length > 0) {
      queryBuilder.andWhere("event.eventType IN (:...eventTypes)", { eventTypes })
    }

    return await queryBuilder.getMany()
  }

  async deleteOldEvents(daysToKeep: number): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    const result = await this.userEventRepository
      .createQueryBuilder()
      .delete()
      .where("createdAt < :cutoffDate", { cutoffDate })
      .execute()

    return result.affected || 0
  }
}
