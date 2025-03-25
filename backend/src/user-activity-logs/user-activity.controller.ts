import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ActivityLogsService } from './user-activity.service';
import { ActivityLog } from './user-activity.entity';
import { ActivityLogDto } from './dto/log-activity.dto';
@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Post()
  async logActivity(
    @Body()
    logActivityDto: ActivityLogDto,
  ): Promise<ActivityLog> {
    return this.activityLogsService.logActivity(logActivityDto);
  }

  @Get()
  async getAllLogs(): Promise<ActivityLog[]> {
    return this.activityLogsService.getAllLogs();
  }

  @Get(':id')
  async getLogById(@Param('id') id: number): Promise<ActivityLog | null> {
    return this.activityLogsService.getLogById(id);
  }
}
