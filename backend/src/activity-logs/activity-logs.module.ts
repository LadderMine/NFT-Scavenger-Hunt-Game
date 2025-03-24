import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { HttpModule } from "@nestjs/axios"
import { ConfigModule } from "@nestjs/config"
import { ActivityLogsController } from "./activity-logs.controller"
import { ActivityLogsService } from "./activity-logs.service"
import { ActivityLog } from "./entities/activity-log.entity"
import { GeoLocationService } from "./services/geo-location.service"
import { ActivityAlertService } from "./services/activity-alert.service"
import { ActivityExportService } from "./services/activity-export.service"
import { ActivityAnalyticsService } from "./services/activity-analytics.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([ActivityLog]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ConfigModule,
  ],
  controllers: [ActivityLogsController],
  providers: [
    ActivityLogsService,
    GeoLocationService,
    ActivityAlertService,
    ActivityExportService,
    ActivityAnalyticsService,
  ],
  exports: [ActivityLogsService],
})
export class ActivityLogsModule {}

