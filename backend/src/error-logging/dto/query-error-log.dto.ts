/* eslint-disable prettier/prettier */
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { ErrorLevel } from '../entities/error-log.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QueryErrorLogDto {
  @ApiProperty({
    description: 'Maximum number of error logs to return',
    default: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({
    description: 'Filter logs by severity level',
    enum: ErrorLevel,
    required: false,
  })
  @IsOptional()
  @IsEnum(ErrorLevel)
  level?: ErrorLevel;
} 