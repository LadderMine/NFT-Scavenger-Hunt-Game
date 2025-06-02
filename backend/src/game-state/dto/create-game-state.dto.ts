import { IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GameStatus } from '../interfaces/game-state.interface';

export class CreateGameStateDto {
  @ApiProperty({ description: 'Player ID' })
  @IsNumber()
  playerId: number;

  @ApiProperty({ description: 'Current puzzle ID', required: false })
  @IsOptional()
  @IsNumber()
  currentPuzzleId?: number;

  @ApiProperty({ description: 'Current level ID', required: false })
  @IsOptional()
  @IsString()
  currentLevelId?: string;

  @ApiProperty({ description: 'Game status', enum: GameStatus })
  @IsEnum(GameStatus)
  gameStatus: GameStatus;
}