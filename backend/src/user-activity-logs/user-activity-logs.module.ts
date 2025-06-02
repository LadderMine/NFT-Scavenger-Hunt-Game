import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsController } from './user-activity.controller';
import { ActivityLogsService } from './user-activity.service';
import { ActivityLog } from './user-activity.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog])],
  controllers: [ActivityLogsController],
  providers: [ActivityLogsService],
  exports: [ActivityLogsService],
})
export class UserActivityLogsModule {}
