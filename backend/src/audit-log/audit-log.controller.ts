import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { AuditLogService } from './audit-log.service';
import { FilterAuditLogDto } from './Dto/filter-audit-log.dto';

@ApiTags('Audit Logs')
@Controller('admin/audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  async getAuditLogs(@Query() filter: FilterAuditLogDto) {
    return this.auditLogService.findAll({
      ...filter,
      startDate: filter.startDate ? new Date(filter.startDate) : undefined,
      endDate: filter.endDate ? new Date(filter.endDate) : undefined,
    });
  }
}
