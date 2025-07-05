import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from './entities/activity-log.entity';
import { UserActivityLogService } from './user-activity-log.service';
import { UserActivityLogController } from './user-activity-log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog])],
  controllers: [UserActivityLogController],
  providers: [UserActivityLogService],
  exports: [UserActivityLogService]
})
export class UserActivityLogModule {}
