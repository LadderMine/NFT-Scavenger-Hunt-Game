import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './user-activity.entity';
import { ActivityLogDto } from './dto/log-activity.dto';

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
  ) {}

  async logActivity(logActivityDto: ActivityLogDto): Promise<ActivityLog> {
    const log = this.activityLogRepository.create({
      ...logActivityDto,
      userId: String(logActivityDto.userId),
    });
    return this.activityLogRepository.save(log);
  }

  async getAllLogs(): Promise<ActivityLog[]> {
    return this.activityLogRepository.find();
  }

  async getLogById(id: number): Promise<ActivityLog | null> {
    return this.activityLogRepository.findOne({ where: { id } });
  }
}
