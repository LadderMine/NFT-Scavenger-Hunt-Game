/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateScoreDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number; // Foreign key reference to User

  @IsNotEmpty()
  @IsNumber()
  puzzleId: number; // Foreign key reference to Puzzle

  @IsNotEmpty()
  @IsNumber()
  score: number; // Score value
}
