import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ActivityLog } from './entities/activity-log.entity';

@Injectable()
export class UserActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly logRepo: Repository<ActivityLog>,
  ) {}

  async logActivity(userId: string, actionType: string, metadata?: any) {
    const log = this.logRepo.create({ userId, actionType, metadata });
    return this.logRepo.save(log);
  }

  async filterLogs({
    userId,
    actionType,
    startDate,
    endDate,
  }: {
    userId?: string;
    actionType?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const query = this.logRepo.createQueryBuilder('log');

    if (userId) query.andWhere('log.userId = :userId', { userId });
    if (actionType) query.andWhere('log.actionType = :actionType', { actionType });
    if (startDate) query.andWhere('log.timestamp >= :startDate', { startDate });
    if (endDate) query.andWhere('log.timestamp <= :endDate', { endDate });

    return query.orderBy('log.timestamp', 'DESC').limit(100).getMany();
  }
}
