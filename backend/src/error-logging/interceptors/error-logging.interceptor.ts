/* eslint-disable prettier/prettier */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorLoggingService } from '../error-logging.service';
import { ErrorLevel } from '../entities/error-log.entity';

@Injectable()
export class ErrorLoggingInterceptor implements NestInterceptor {
  constructor(private readonly errorLoggingService: ErrorLoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        const request = context.switchToHttp().getRequest();
        const path = request?.url || 'Unknown Path';
        const contextInfo = `${context.getClass().name}.${context.getHandler().name}`;

        // Determine error level based on status code
        let level = ErrorLevel.ERROR;
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        
        if (error instanceof HttpException) {
          status = error.getStatus();
          if (status < 500) {
            level = ErrorLevel.WARNING;
          }
        }

        // Log the error
        this.errorLoggingService.logErrorAsync(
          error.message || 'Unknown error',
          error.stack,
          `${contextInfo} (${path})`,
          level,
        );
        
        // Re-throw the error to be handled by global exception filter
        throw error;
      }),
    );
  }
} 