import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  Body,
  Post,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { FilterActivityDto } from './dto/filter-activity.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';

@ApiTags('Activity History')
@ApiBearerAuth()
@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @ApiOperation({ summary: 'Get user activity history' })
  @ApiResponse({ status: 200, description: 'User activity list retrieved successfully.' })
  async getMyActivities(
    @Query() filter: FilterActivityDto,
    @Req() req,
  ): Promise<{
    data: Activity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.activityService.getUserActivities(req.user.id, filter);
  }

   @Post()
  @ApiOperation({ summary: 'Log an activity (for testing/admin)' })
  @ApiBody({ type: CreateActivityDto })
  @ApiResponse({
    status: 201,
    description: 'Activity successfully logged.',
    type: Activity,
  })
  async createActivity(
    @Body() dto: CreateActivityDto,
    @Req() req,
  ): Promise<Activity[]> {
    return this.activityService.logActivity(req.user.id, dto.type, dto.metadata);
  }
}