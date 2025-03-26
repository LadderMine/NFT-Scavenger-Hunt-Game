/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorLog, ErrorLevel } from './entities/error-log.entity';
import { CreateErrorLogDto } from './dto/create-error-log.dto';
import { QueryErrorLogDto } from './dto/query-error-log.dto';

@Injectable()
export class ErrorLoggingService {
  constructor(
    @InjectRepository(ErrorLog)
    private errorLogRepository: Repository<ErrorLog>,
  ) {}

  /**
   * Log an error to the database
   * @param createErrorLogDto Error log data
   * @returns The created error log entity
   */
  async logError(createErrorLogDto: CreateErrorLogDto): Promise<ErrorLog> {
    const errorLog = this.errorLogRepository.create({
      message: createErrorLogDto.message,
      stackTrace: createErrorLogDto.stackTrace,
      context: createErrorLogDto.context,
      level: createErrorLogDto.level || ErrorLevel.ERROR,
    });

    return this.errorLogRepository.save(errorLog);
  }

  /**
   * Get recent error logs with optional filtering
   * @param queryParams Parameters for filtering logs
   * @returns A list of error logs
   */
  async getRecentErrors(queryParams: QueryErrorLogDto): Promise<ErrorLog[]> {
    const { limit = 10, level } = queryParams;
    
    const queryBuilder = this.errorLogRepository.createQueryBuilder('error_log')
      .orderBy('error_log.timestamp', 'DESC')
      .take(limit);
    
    if (level) {
      queryBuilder.andWhere('error_log.level = :level', { level });
    }
    
    return queryBuilder.getMany();
  }

  /**
   * Log an error without awaiting the result
   * Useful when you don't want to block execution
   * @param message Error message
   * @param stackTrace Optional stack trace
   * @param context Module or function where the error occurred
   * @param level Error severity level
   */
  logErrorAsync(
    message: string,
    stackTrace?: string,
    context?: string,
    level: ErrorLevel = ErrorLevel.ERROR,
  ): void {
    const errorLog = this.errorLogRepository.create({
      message,
      stackTrace,
      context: context || 'Unknown',
      level,
    });

    this.errorLogRepository.save(errorLog).catch(saveError => {
      // Log to console as a fallback if we can't save to DB
      console.error('Failed to save error log:', saveError);
      console.error('Original error:', { message, stackTrace, context, level });
    });
  }
} 