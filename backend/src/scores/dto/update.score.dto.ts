/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateScoreDto {
  @IsOptional()
  @IsNumber()
  score?: number; // Allow updating the score value

  @IsOptional()
  @IsNumber()
  userId?: number; // Allow updating the associated user

  @IsOptional()
  @IsNumber()
  puzzleId?: number; // Allow updating the associated puzzle
}
