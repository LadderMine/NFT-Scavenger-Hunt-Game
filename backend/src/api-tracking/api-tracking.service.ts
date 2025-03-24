import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiTracking } from './entities/api-tracking.entity';

@Injectable()
export class ApiTrackingService {
  constructor(
    @InjectRepository(ApiTracking)
    private readonly apiTrackingRepository: Repository<ApiTracking>,
  ) {}

  async logRequest(data: Omit<ApiTracking, 'id' | 'timestamp'>): Promise<void> {
    await this.apiTrackingRepository.insert(data);
  }

  async getLogs(
    page = 1,
    limit = 10,
    filters: { method?: string; statusCode?: number; startDate?: string; endDate?: string },
  ): Promise<{ data: ApiTracking[]; total: number }> {
    const query = this.apiTrackingRepository.createQueryBuilder('log');

    if (filters.method) query.andWhere('log.method = :method', { method: filters.method });
    if (filters.statusCode) query.andWhere('log.statusCode = :statusCode', { statusCode: filters.statusCode });
    if (filters.startDate && filters.endDate) {
      query.andWhere('log.timestamp BETWEEN :startDate AND :endDate', {
        startDate: new Date(filters.startDate),
        endDate: new Date(filters.endDate),
      });
    }

    const [data, total] = await query.skip((page - 1) * limit).take(limit).getManyAndCount();
    return { data, total };
  }
}
