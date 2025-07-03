import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  async createLog(userId: string, action: string, meta?: Record<string, any>) {
    const log = this.auditRepo.create({ userId, action, meta });
    return this.auditRepo.save(log);
  }

  async findAll(filters: {
    userId?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = Like(`%${filters.action}%`);
    if (filters.startDate && filters.endDate)
      where.timestamp = Between(filters.startDate, filters.endDate);

    return this.auditRepo.find({ where, order: { timestamp: 'DESC' } });
  }
}
