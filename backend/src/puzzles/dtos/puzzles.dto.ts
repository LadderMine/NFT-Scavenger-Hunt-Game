/* eslint-disable prettier/prettier */
import { IsInt, IsNotEmpty, IsOptional, IsDate } from 'class-validator';

export class PuzzleDto {
  @IsOptional() // ID is usually auto-generated
  id?: number;

  @IsInt()
  @IsNotEmpty()
  pointValue: number;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}
