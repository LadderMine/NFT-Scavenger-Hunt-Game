import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Repository } from 'typeorm';
import { FilterActivityDto } from './dto/filter-activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepo: Repository<Activity>,
  ) {}

  async getUserActivities(userId: string, filter: FilterActivityDto) {
    const query = this.activityRepo.createQueryBuilder('activity')
      .where('activity.userId = :userId', { userId });

    if (filter.type) {
      query.andWhere('activity.type = :type', { type: filter.type });
    }

    if (filter.from) {
      query.andWhere('activity.createdAt >= :from', { from: filter.from });
    }

    if (filter.to) {
      query.andWhere('activity.createdAt <= :to', { to: filter.to });
    }

    const limit = filter.limit || 10;
    const page = filter.page || 1;
    const offset = (page - 1) * limit;

    const [data, total] = await query
      .orderBy('activity.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async logActivity(userId: string, type: string, metadata: Record<string, any> = {}) {
    const activity = this.activityRepo.create({ user: { id: userId }, type, metadata });
    return this.activityRepo.save(activity);
  }
}