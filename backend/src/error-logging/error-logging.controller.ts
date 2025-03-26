/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ErrorLoggingService } from './error-logging.service';
import { CreateErrorLogDto } from './dto/create-error-log.dto';
import { QueryErrorLogDto } from './dto/query-error-log.dto';
import { ErrorLog } from './entities/error-log.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth/jwt-auth.guard';

@ApiTags('error-logging')
@Controller('error-logging')
export class ErrorLoggingController {
  constructor(private readonly errorLoggingService: ErrorLoggingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new error log' })
  @ApiResponse({ 
    status: 201, 
    description: 'The error log has been successfully created',
    type: ErrorLog
  })
  async create(@Body() createErrorLogDto: CreateErrorLogDto): Promise<ErrorLog> {
    return this.errorLoggingService.logError(createErrorLogDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get recent error logs' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of recent error logs',
    type: [ErrorLog]
  })
  async findRecent(@Query() queryParams: QueryErrorLogDto): Promise<ErrorLog[]> {
    return this.errorLoggingService.getRecentErrors(queryParams);
  }
} 