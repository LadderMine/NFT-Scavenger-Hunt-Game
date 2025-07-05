import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { GeoStats } from './entities/geostat.entity';
import { GeoStatsService } from './geostats.service';
import { GeoStatsController } from './geostats.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GeoStats]), HttpModule],
  providers: [GeoStatsService],
  controllers: [GeoStatsController],
})
export class GeoStatsModule {}