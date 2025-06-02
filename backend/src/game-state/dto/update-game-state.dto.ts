import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsBoolean, IsObject } from 'class-validator';
import { CreateGameStateDto } from './create-game-state.dto';

export class UpdateGameStateDto extends PartialType(CreateGameStateDto) {
  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsBoolean()
  timerActive?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}