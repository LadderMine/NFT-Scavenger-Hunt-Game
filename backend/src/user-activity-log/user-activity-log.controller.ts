import { Controller, Get, Query } from '@nestjs/common';
import { UserActivityLogService } from './user-activity-log.service';
import { FilterActivityDto } from './dto/filter-activity.dto';

@Controller('admin/activity-logs')
export class UserActivityLogController {
  constructor(private readonly logService: UserActivityLogService) {}

  @Get()
  async getFilteredLogs(@Query() query: FilterActivityDto) {
    return this.logService.filterLogs({
      ...query,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
    });
  }
}
