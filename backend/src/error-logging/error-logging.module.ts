/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorLoggingService } from './error-logging.service';
import { ErrorLoggingController } from './error-logging.controller';
import { ErrorLog } from './entities/error-log.entity';
import { GetRecentErrorsCommand } from './commands/get-recent-errors.command';

@Module({
  imports: [TypeOrmModule.forFeature([ErrorLog])],
  controllers: [ErrorLoggingController],
  providers: [ErrorLoggingService, GetRecentErrorsCommand],
  exports: [ErrorLoggingService],
})
export class ErrorLoggingModule {} 