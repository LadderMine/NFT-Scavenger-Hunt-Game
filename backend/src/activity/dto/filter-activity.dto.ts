import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ActivityType } from '../entities/activity.entity';
import { Type } from 'class-transformer';

export class FilterActivityDto {
  @ApiPropertyOptional({ enum: ActivityType, description: 'Filter by activity type' })
  @IsOptional()
  @IsEnum(ActivityType)
  type?: ActivityType;

  @ApiPropertyOptional({ type: String, format: 'date-time', description: 'Filter from date (ISO string)' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time', description: 'Filter to date (ISO string)' })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({ type: Number, example: 10, description: 'Results per page' })
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ type: Number, example: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  page?: number;
}