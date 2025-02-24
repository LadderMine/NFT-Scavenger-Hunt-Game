/* eslint-disable prettier/prettier */
import { IsNumber, IsOptional } from 'class-validator';

export class UpdatePuzzleDto {
  @IsOptional()
  @IsNumber()
  pointValue?: number; // Allow updating the point value

  @IsOptional()
  @IsNumber()
  levelId?: number; // Allow updating the associated level
}
