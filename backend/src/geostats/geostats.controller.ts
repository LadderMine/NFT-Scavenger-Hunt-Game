
import { Controller, Post, Get, Ip } from '@nestjs/common';
import { GeoStatsService } from './geostats.service';

@Controller('geostats')
export class GeoStatsController {
  constructor(private readonly geoStatsService: GeoStatsService) {}

  @Post('track')
  track(@Ip() ip: string) {
    
    return this.geoStatsService.trackUser(ip);
  }

  @Get('stats')
  getStats() {
    return this.geoStatsService.getStats();
  }
}