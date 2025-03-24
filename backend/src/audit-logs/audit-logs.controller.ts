/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';
import { AccessTokenGuard } from '../auth/guard/access-token/access-token.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';

@Controller('audit-logs')
@UseGuards(AccessTokenGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @Roles(Role.ADMIN) // Use the enum value instead of string
  findAll(@Query() queryParams: QueryAuditLogDto) {
    return this.auditLogsService.findAll(queryParams);
  }

  @Get(':id')
  @Roles(Role.ADMIN) // Use the enum value instead of string
  findOne(@Param('id') id: string) {
    return this.auditLogsService.findOne(id);
  }
}
