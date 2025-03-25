import { Injectable, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Between, type FindOptionsWhere, LessThanOrEqual, type Repository } from "typeorm"
import { ActivityLog } from "./entities/activity-log.entity"
import type { CreateActivityLogDto } from "./dto/create-activity-log.dto"
import type { QueryActivityLogsDto } from "./dto/query-activity-logs.dto"
import type { AnonymizeLogsDto } from "./dto/anonymize-logs.dto"
import type { GeoLocationService } from "./services/geo-location.service"
import type { ActivityAlertService } from "./services/activity-alert.service"
import { v4 as uuidv4 } from "uuid"

@Injectable()
export class ActivityLogsService {
  private readonly logger = new Logger(ActivityLogsService.name)
  private readonly batchSize = 100;

  constructor(
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
    private geoLocationService: GeoLocationService,
    private activityAlertService: ActivityAlertService,
  ) {}

  /**
   * Create a new activity log entry
   */
  async create(createActivityLogDto: CreateActivityLogDto): Promise<ActivityLog> {
    try {
      // Generate a unique request ID if not provided
      if (!createActivityLogDto.requestId) {
        createActivityLogDto.requestId = uuidv4()
      }

      // Get geolocation data if IP is provided
      if (createActivityLogDto.ipAddress && !createActivityLogDto.geoLocation) {
        createActivityLogDto.geoLocation = await this.geoLocationService.getLocationFromIp(
          createActivityLogDto.ipAddress,
        )
      }

      const activityLog = this.activityLogRepository.create(createActivityLogDto)
      const savedLog = await this.activityLogRepository.save(activityLog)

      // Process the log for alerts
      this.activityAlertService.processActivityLog(savedLog).catch((error) => {
        this.logger.error(`Error processing activity log for alerts: ${error.message}`)
      })

      return savedLog
    } catch (error) {
      this.logger.error(`Error creating activity log: ${error.message}`)
      throw error
    }
  }

  /**
   * Create multiple activity logs in a batch
   */
  async createBatch(createDtos: CreateActivityLogDto[]): Promise<{ count: number }> {
    if (!createDtos.length) {
      return { count: 0 }
    }

    try {
      // Process in batches to avoid overwhelming the database
      let processedCount = 0

      for (let i = 0; i < createDtos.length; i += this.batchSize) {
        const batch = createDtos.slice(i, i + this.batchSize)

        // Prepare logs with additional data
        const logsToCreate = await Promise.all(
          batch.map(async (dto) => {
            // Generate a unique request ID if not provided
            if (!dto.requestId) {
              dto.requestId = uuidv4()
            }

            // Get geolocation data if IP is provided
            if (dto.ipAddress && !dto.geoLocation) {
              dto.geoLocation = await this.geoLocationService.getLocationFromIp(dto.ipAddress)
            }

            return this.activityLogRepository.create(dto)
          }),
        )

        const savedLogs = await this.activityLogRepository.save(logsToCreate)
        processedCount += savedLogs.length

        // Process logs for alerts (in background)
        savedLogs.forEach((log) => {
          this.activityAlertService.processActivityLog(log).catch((error) => {
            this.logger.error(`Error processing activity log for alerts: ${error.message}`)
          })
        })
      }

      return { count: processedCount }
    } catch (error) {
      this.logger.error(`Error creating batch activity logs: ${error.message}`)
      throw error
    }
  }

  /**
   * Find all activity logs with optional filtering and pagination
   */
  async findAll(queryParams: QueryActivityLogsDto): Promise<{
    data: ActivityLog[]
    total: number
    page: number
    limit: number
  }> {
    const {
      userId,
      userIds,
      action,
      actions,
      category,
      categories,
      severity,
      severities,
      resourceType,
      resourceId,
      ipAddress,
      sessionId,
      requestId,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "DESC",
      includeAnonymized = false,
      searchTerm,
    } = queryParams

    const skip = (page - 1) * limit

    // Build where conditions
    const where: FindOptionsWhere<ActivityLog> = {}

    if (userId) {
      where.userId = userId
    }

    if (userIds && userIds.length > 0) {
      where.userId = { $in: userIds } as any
    }

    if (action) {
      where.action = action
    }

    if (actions && actions.length > 0) {
      where.action = { $in: actions } as any
    }

    if (category) {
      where.category = category
    }

    if (categories && categories.length > 0) {
      where.category = { $in: categories } as any
    }

    if (severity) {
      where.severity = severity
    }

    if (severities && severities.length > 0) {
      where.severity = { $in: severities } as any
    }

    if (resourceType) {
      where.resourceType = resourceType
    }

    if (resourceId) {
      where.resourceId = resourceId
    }

    if (ipAddress) {
      where.ipAddress = ipAddress
    }

    if (sessionId) {
      where.sessionId = sessionId
    }

    if (requestId) {
      where.requestId = requestId
    }

    // Handle date range filtering
    if (startDate && endDate) {
      where.createdAt = Between(new Date(startDate), new Date(endDate))
    } else if (startDate) {
      where.createdAt = Between(new Date(startDate), new Date())
    } else if (endDate) {
      where.createdAt = LessThanOrEqual(new Date(endDate))
    }

    if (!includeAnonymized) {
      where.isAnonymized = false
    }

    // Handle search term
    let queryBuilder = this.activityLogRepository.createQueryBuilder("log")

    // Apply all the where conditions
    Object.entries(where).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === "object" && value !== null) {
          if ("$in" in value) {
            queryBuilder = queryBuilder.andWhere(`log.${key} IN (:...${key})`, { [key]: value.$in })
          } else if ("$gte" in value && "$lte" in value) {
            queryBuilder = queryBuilder.andWhere(`log.${key} BETWEEN :${key}Start AND :${key}End`, {
              [`${key}Start`]: value.$gte,
              [`${key}End`]: value.$lte,
            })
          } else if ("$lte" in value) {
            queryBuilder = queryBuilder.andWhere(`log.${key} <= :${key}End`, { [`${key}End`]: value.$lte })
          } else {
            queryBuilder = queryBuilder.andWhere(`log.${key} = :${key}`, { [key]: value })
          }
        } else {
          queryBuilder = queryBuilder.andWhere(`log.${key} = :${key}`, { [key]: value })
        }
      }
    })

    // Add search term if provided
    if (searchTerm) {
      queryBuilder = queryBuilder.andWhere(
        "(log.action::text ILIKE :searchTerm OR log.userId::text ILIKE :searchTerm OR log.ipAddress ILIKE :searchTerm OR log.metadata::text ILIKE :searchTerm)",
        { searchTerm: `%${searchTerm}%` },
      )
    }

    // Add sorting
    queryBuilder = queryBuilder.orderBy(`log.${sortBy}`, sortOrder as "ASC" | "DESC")

    // Add pagination
    queryBuilder = queryBuilder.skip(skip).take(limit)

    // Execute query with pagination
    const [data, total] = await queryBuilder.getManyAndCount()

    return {
      data,
      total,
      page,
      limit,
    }
  }

  /**
   * Find a single activity log by ID
   */
  async findOne(id: string): Promise<ActivityLog> {
    return this.activityLogRepository.findOneBy({ id })
  }

  /**
   * Delete activity logs older than the specified date
   */
  async deleteOldLogs(olderThan: Date): Promise<{ deleted: number }> {
    try {
      const result = await this.activityLogRepository
        .createQueryBuilder()
        .delete()
        .where("createdAt < :olderThan", { olderThan })
        .execute()

      return { deleted: result.affected || 0 }
    } catch (error) {
      this.logger.error(`Error deleting old logs: ${error.message}`)
      throw error
    }
  }

  /**
   * Anonymize user data in logs
   */
  async anonymizeLogs(anonymizeDto: AnonymizeLogsDto): Promise<{ anonymized: number }> {
    try {
      const { userId, userIds, olderThan } = anonymizeDto

      let queryBuilder = this.activityLogRepository
        .createQueryBuilder()
        .update()
        .set({
          userId: null,
          ipAddress: null,
          userAgent: null,
          sessionId: null,
          geoLocation: null,
          isAnonymized: true,
          metadata: () => "jsonb_set(metadata, '{anonymized}', 'true')",
        })

      if (userId) {
        queryBuilder = queryBuilder.where("userId = :userId", { userId })
      }

      if (userIds && userIds.length > 0) {
        queryBuilder = queryBuilder.where("userId IN (:...userIds)", { userIds })
      }

      if (olderThan) {
        const date = new Date(olderThan)
        if (userId || (userIds && userIds.length > 0)) {
          queryBuilder = queryBuilder.andWhere("createdAt < :olderThan", { olderThan: date })
        } else {
          queryBuilder = queryBuilder.where("createdAt < :olderThan", { olderThan: date })
        }
      }

      const result = await queryBuilder.execute()

      return { anonymized: result.affected || 0 }
    } catch (error) {
      this.logger.error(`Error anonymizing logs: ${error.message}`)
      throw error
    }
  }

  /**
   * Get summary statistics for activity logs
   */
  async getStatistics(
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    totalLogs: number
    uniqueUsers: number
    topActions: { action: string; count: number }[]
    topIpAddresses: { ipAddress: string; count: number }[]
    activityByDay: { date: string; count: number }[]
  }> {
    try {
      // Set default date range if not provided
      const end = endDate || new Date()
      const start = startDate || new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000) // Default: last 30 days

      // Total logs count
      const totalLogs = await this.activityLogRepository.count({
        where: {
          createdAt: Between(start, end),
        },
      })

      // Unique users count
      const uniqueUsersResult = await this.activityLogRepository
        .createQueryBuilder("log")
        .select("COUNT(DISTINCT log.userId)", "count")
        .where("log.createdAt BETWEEN :start AND :end", { start, end })
        .andWhere("log.userId IS NOT NULL")
        .getRawOne()

      const uniqueUsers = Number.parseInt(uniqueUsersResult?.count || "0", 10)

      // Top actions
      const topActions = await this.activityLogRepository
        .createQueryBuilder("log")
        .select("log.action", "action")
        .addSelect("COUNT(*)", "count")
        .where("log.createdAt BETWEEN :start AND :end", { start, end })
        .groupBy("log.action")
        .orderBy("count", "DESC")
        .limit(5)
        .getRawMany()

      // Top IP addresses
      const topIpAddresses = await this.activityLogRepository
        .createQueryBuilder("log")
        .select("log.ipAddress", "ipAddress")
        .addSelect("COUNT(*)", "count")
        .where("log.createdAt BETWEEN :start AND :end", { start, end })
        .andWhere("log.ipAddress IS NOT NULL")
        .groupBy("log.ipAddress")
        .orderBy("count", "DESC")
        .limit(5)
        .getRawMany()

      // Activity by day
      const activityByDay = await this.activityLogRepository
        .createQueryBuilder("log")
        .select("to_char(log.createdAt, 'YYYY-MM-DD')", "date")
        .addSelect("COUNT(*)", "count")
        .where("log.createdAt BETWEEN :start AND :end", { start, end })
        .groupBy("to_char(log.createdAt, 'YYYY-MM-DD')")
        .orderBy("date", "ASC")
        .getRawMany()

      return {
        totalLogs,
        uniqueUsers,
        topActions: topActions.map((item) => ({
          action: item.action,
          count: Number.parseInt(item.count, 10),
        })),
        topIpAddresses: topIpAddresses.map((item) => ({
          ipAddress: item.ipAddress,
          count: Number.parseInt(item.count, 10),
        })),
        activityByDay: activityByDay.map((item) => ({
          date: item.date,
          count: Number.parseInt(item.count, 10),
        })),
      }
    } catch (error) {
      this.logger.error(`Error getting statistics: ${error.message}`)
      throw error
    }
  }
}

