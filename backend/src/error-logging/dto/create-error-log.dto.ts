/* eslint-disable prettier/prettier */
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ErrorLevel } from '../entities/error-log.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateErrorLogDto {
  @ApiProperty({
    description: 'Error message',
    example: 'Failed to connect to database',
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Stack trace for the error',
    example: 'Error: Failed to connect\n    at Connection.connect (/app/src/database.ts:45)',
    required: false,
  })
  @IsOptional()
  @IsString()
  stackTrace?: string;

  @ApiProperty({
    description: 'Module or function where the error occurred',
    example: 'UserService.findById',
  })
  @IsNotEmpty()
  @IsString()
  context: string;

  @ApiProperty({
    description: 'Error severity level',
    enum: ErrorLevel,
    default: ErrorLevel.ERROR,
    example: 'ERROR',
  })
  @IsOptional()
  @IsEnum(ErrorLevel)
  level?: ErrorLevel;
} 