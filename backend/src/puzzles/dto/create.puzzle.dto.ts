/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePuzzleDto {
  @IsNotEmpty()
  @IsNumber()
  pointValue: number; // Points assigned to the puzzle

  @IsNotEmpty()
  @IsNumber()
  levelId: number; // Foreign key reference to Level
}
