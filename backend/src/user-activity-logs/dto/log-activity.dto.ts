import { IsOptional, IsString, IsObject, IsNumber } from 'class-validator';

export class ActivityLogDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsString()
  action: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
