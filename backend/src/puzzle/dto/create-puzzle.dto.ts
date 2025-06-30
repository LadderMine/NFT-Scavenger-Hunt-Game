import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePuzzleDto {
  @ApiProperty({ example: 'Puzzle Title' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'Puzzle description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'easy', enum: ['easy', 'medium', 'hard'] })
  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @ApiPropertyOptional({ example: 'This is a hint' })
  @IsOptional()
  @IsString()
  hint?: string;

  @ApiProperty({ example: 'solution123' })
  @IsString()
  @IsNotEmpty()
  solution: string;

  @ApiPropertyOptional({ example: 'reward-uuid' })
  @IsOptional()
  @IsString()
  rewardId?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  isActive?: boolean;
}
