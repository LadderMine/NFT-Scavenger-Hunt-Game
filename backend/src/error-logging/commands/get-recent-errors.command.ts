/* eslint-disable prettier/prettier */
import { Command, CommandRunner, Option } from 'nest-commander';
import { ErrorLoggingService } from '../error-logging.service';
import { ErrorLevel } from '../entities/error-log.entity';
import { Injectable } from '@nestjs/common';
import { QueryErrorLogDto } from '../dto/query-error-log.dto';

interface CommandOptions {
  limit?: number;
  level?: ErrorLevel;
}

@Injectable()
@Command({ name: 'get-errors', description: 'Retrieve recent error logs' })
export class GetRecentErrorsCommand extends CommandRunner {
  constructor(private readonly errorLoggingService: ErrorLoggingService) {
    super();
  }

  async run(passedParams: string[], options?: CommandOptions): Promise<void> {
    const queryParams: QueryErrorLogDto = {
      limit: options?.limit || 10,
      level: options?.level,
    };

    const errors = await this.errorLoggingService.getRecentErrors(queryParams);

    if (errors.length === 0) {
      console.log('No error logs found.');
      return;
    }

    console.log(`Found ${errors.length} error logs:`);
    errors.forEach((error, index) => {
      console.log(`\n--- Error ${index + 1} ---`);
      console.log(`ID: ${error.id}`);
      console.log(`Message: ${error.message}`);
      console.log(`Context: ${error.context}`);
      console.log(`Level: ${error.level}`);
      console.log(`Timestamp: ${error.timestamp}`);
      
      if (error.stackTrace) {
        console.log(`\nStack Trace:\n${error.stackTrace}`);
      }
    });
  }

  @Option({
    flags: '-l, --limit [number]',
    description: 'Maximum number of errors to retrieve',
  })
  parseLimit(val: string): number {
    return Number(val);
  }

  @Option({
    flags: '--level [level]',
    description: 'Filter by error level (INFO, WARNING, ERROR, CRITICAL)',
  })
  parseLevel(val: string): ErrorLevel {
    const upperVal = val.toUpperCase();
    if (Object.values(ErrorLevel).includes(upperVal as ErrorLevel)) {
      return upperVal as ErrorLevel;
    }
    throw new Error(`Invalid error level: ${val}. Valid options are: ${Object.values(ErrorLevel).join(', ')}`);
  }
} 