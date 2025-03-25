import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Req,
  Param,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  Res,
} from "@nestjs/common"
import type { Request, Response } from "express"
import type { ActivityLogsService } from "./activity-logs.service"
import type { CreateActivityLogDto } from "./dto/create-activity-log.dto"
import type { QueryActivityLogsDto } from "./dto/query-activity-logs.dto"
import { type ExportActivityLogsDto, ExportFormat } from "./dto/export-activity-logs.dto"
import type { AnonymizeLogsDto } from "./dto/anonymize-logs.dto"
import type { ActivityLog } from "./entities/activity-log.entity"
import type { ActivityExportService } from "./services/activity-export.service"
import type { ActivityAnalyticsService } from "./services/activity-analytics.service"

@Controller("activity-logs")
@UseInterceptors(ClassSerializerInterceptor)
export class ActivityLogsController {
  constructor(
    private readonly activityLogsService: ActivityLogsService,
    private readonly activityExportService: ActivityExportService,
    private readonly activityAnalyticsService: ActivityAnalyticsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createActivityLogDto: CreateActivityLogDto, @Req() request: Request): Promise<ActivityLog> {
    // Automatically capture IP and user agent if not provided
    if (!createActivityLogDto.ipAddress) {
      createActivityLogDto.ipAddress = request.ip
    }

    if (!createActivityLogDto.userAgent) {
      createActivityLogDto.userAgent = request.headers["user-agent"]
    }

    if (!createActivityLogDto.requestPath) {
      createActivityLogDto.requestPath = request.path
    }

    if (!createActivityLogDto.requestMethod) {
      createActivityLogDto.requestMethod = request.method
    }

    return this.activityLogsService.create(createActivityLogDto)
  }

  @Post("batch")
  @HttpCode(HttpStatus.CREATED)
  async createBatch(@Body() createActivityLogDtos: CreateActivityLogDto[], @Req() request: Request) {
    // Automatically capture IP and user agent if not provided
    createActivityLogDtos.forEach((dto) => {
      if (!dto.ipAddress) {
        dto.ipAddress = request.ip
      }

      if (!dto.userAgent) {
        dto.userAgent = request.headers["user-agent"]
      }

      if (!dto.requestPath) {
        dto.requestPath = request.path
      }

      if (!dto.requestMethod) {
        dto.requestMethod = request.method
      }
    })

    return this.activityLogsService.createBatch(createActivityLogDtos)
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true })) query: QueryActivityLogsDto,
  ) {
    return this.activityLogsService.findAll(query);
  }

  @Get("export")
  async exportLogs(
    @Query(new ValidationPipe({ transform: true })) query: ExportActivityLogsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { format = ExportFormat.CSV, ...queryParams } = query

    const { data, filename, contentType } = await this.activityExportService.exportLogs(queryParams, format)

    res.set({
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
    })

    return data
  }

  @Get("statistics")
  async getStatistics(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.activityLogsService.getStatistics(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    )
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.activityLogsService.findOne(id);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteOldLogs(@Query('olderThan') olderThan: string) {
    const date = olderThan ? new Date(olderThan) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: 30 days
    return this.activityLogsService.deleteOldLogs(date);
  }

  @Post('anonymize')
  @HttpCode(HttpStatus.OK)
  async anonymizeLogs(@Body() anonymizeDto: AnonymizeLogsDto) {
    return this.activityLogsService.anonymizeLogs(anonymizeDto);
  }

  @Get("analytics/time-series")
  async getActivityTimeSeries(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('interval') interval: 'hour' | 'day' | 'week' | 'month' = 'day',
  ) {
    return this.activityAnalyticsService.getActivityTimeSeries(
      new Date(startDate || Date.now() - 30 * 24 * 60 * 60 * 1000),
      new Date(endDate || Date.now()),
      interval,
    )
  }

  @Get("analytics/actions")
  async getActionDistribution(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.activityAnalyticsService.getActionDistribution(
      new Date(startDate || Date.now() - 30 * 24 * 60 * 60 * 1000),
      new Date(endDate || Date.now()),
    )
  }

  @Get("analytics/categories")
  async getCategoryDistribution(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.activityAnalyticsService.getCategoryDistribution(
      new Date(startDate || Date.now() - 30 * 24 * 60 * 60 * 1000),
      new Date(endDate || Date.now()),
    )
  }

  @Get("analytics/users")
  async getMostActiveUsers(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('limit') limit: number = 10,
  ) {
    return this.activityAnalyticsService.getMostActiveUsers(
      new Date(startDate || Date.now() - 30 * 24 * 60 * 60 * 1000),
      new Date(endDate || Date.now()),
      limit,
    )
  }

  @Get("analytics/anomalies")
  async getAnomalousActivities(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('threshold') threshold: number = 2.0,
  ) {
    return this.activityAnalyticsService.getAnomalousActivities(
      new Date(startDate || Date.now() - 30 * 24 * 60 * 60 * 1000),
      new Date(endDate || Date.now()),
      threshold,
    )
  }
}

