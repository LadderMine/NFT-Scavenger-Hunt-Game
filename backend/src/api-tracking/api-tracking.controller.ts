import { Controller, Get, Query } from '@nestjs/common';
import { ApiTrackingService } from './api-tracking.service';

@Controller('api-tracking')
export class ApiTrackingController {
  constructor(private readonly apiTrackingService: ApiTrackingService) {}

  @Get()
  async getLogs(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('method') method?: string,
    @Query('statusCode') statusCode?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.apiTrackingService.getLogs(+page, +limit, {
      method,
      statusCode: statusCode ? +statusCode : undefined,
      startDate,
      endDate,
    });
  }
}
