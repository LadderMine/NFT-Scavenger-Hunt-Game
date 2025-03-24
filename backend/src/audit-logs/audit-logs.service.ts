/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create(createAuditLogDto);
    return this.auditLogRepository.save(auditLog);
  }

  async findAll(
    queryParams: QueryAuditLogDto,
  ): Promise<{ data: AuditLog[]; total: number; page: number; limit: number }> {
    const page = queryParams.page ? parseInt(queryParams.page, 10) : 1;
    const limit = queryParams.limit ? parseInt(queryParams.limit, 10) : 10;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<AuditLog> = {};

    if (queryParams.eventType) {
      where.eventType = queryParams.eventType;
    }

    if (queryParams.userId) {
      where.userId = queryParams.userId;
    }

    if (queryParams.username) {
      where.username = queryParams.username;
    }

    if (queryParams.resource) {
      where.resource = queryParams.resource;
    }

    if (queryParams.action) {
      where.action = queryParams.action;
    }

    if (queryParams.status) {
      where.status = queryParams.status;
    }

    if (queryParams.startDate && queryParams.endDate) {
      where.timestamp = Between(
        new Date(queryParams.startDate),
        new Date(queryParams.endDate),
      );
    }

    const [data, total] = await this.auditLogRepository.findAndCount({
      where,
      order: { timestamp: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<AuditLog> {
    return this.auditLogRepository.findOne({ where: { id } });
  }

  // Helper methods for common audit events
  async logUserLogin(
    userId: string,
    username: string,
    ipAddress: string,
    success: boolean,
    metadata?: Record<string, any>,
  ): Promise<AuditLog> {
    return this.create({
      eventType: 'USER_AUTHENTICATION',
      userId,
      username,
      ipAddress,
      action: 'LOGIN',
      status: success ? 'SUCCESS' : 'FAILURE',
      resource: 'USER',
      resourceId: userId,
      metadata,
    });
  }

  async logPasswordChange(
    userId: string,
    username: string,
    ipAddress: string,
    success: boolean,
    metadata?: Record<string, any>,
  ): Promise<AuditLog> {
    return this.create({
      eventType: 'USER_ACCOUNT',
      userId,
      username,
      ipAddress,
      action: 'PASSWORD_CHANGE',
      status: success ? 'SUCCESS' : 'FAILURE',
      resource: 'USER',
      resourceId: userId,
      metadata,
    });
  }

  async logRoleUpdate(
    userId: string,
    username: string,
    ipAddress: string,
    targetUserId: string,
    oldRoles: string[],
    newRoles: string[],
  ): Promise<AuditLog> {
    return this.create({
      eventType: 'USER_PERMISSION',
      userId,
      username,
      ipAddress,
      action: 'ROLE_UPDATE',
      status: 'SUCCESS',
      resource: 'USER',
      resourceId: targetUserId,
      metadata: {
        oldRoles,
        newRoles,
      },
    });
  }

  async logConfigChange(
    userId: string,
    username: string,
    ipAddress: string,
    configName: string,
    oldValue: any,
    newValue: any,
  ): Promise<AuditLog> {
    return this.create({
      eventType: 'SYSTEM_CONFIG',
      userId,
      username,
      ipAddress,
      action: 'UPDATE',
      status: 'SUCCESS',
      resource: 'CONFIG',
      resourceId: configName,
      metadata: {
        oldValue,
        newValue,
      },
    });
  }
}
