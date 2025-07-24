import { ApiProperty } from '@nestjs/swagger';
import { ActivityType } from '../entities/activity.entity';
import { IsEnum, IsOptional, IsObject } from 'class-validator';

export class CreateActivityDto {
  @ApiProperty({ enum: ActivityType })
  @IsEnum(ActivityType)
  type: ActivityType;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}