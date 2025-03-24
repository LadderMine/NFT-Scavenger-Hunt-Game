import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './user-activity.entity';

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
  ) {}

  async logActivity(
    userId: string | null,
    action: string,
    metadata?: Record<string, any>,
  ): Promise<ActivityLog> {
    const log = this.activityLogRepository.create({ userId, action, metadata });
    return this.activityLogRepository.save(log);
  }

  async getAllLogs(): Promise<ActivityLog[]> {
    return this.activityLogRepository.find();
  }

  async getLogById(id: number): Promise<ActivityLog | null> {
    return this.activityLogRepository.findOne({ where: { id } });
  }
}
