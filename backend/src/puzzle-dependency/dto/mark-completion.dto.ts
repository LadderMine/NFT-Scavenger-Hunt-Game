import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarkCompletionDto {
  @ApiProperty({ description: 'User ID who completed the puzzle' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Puzzle ID that was completed' })
  @IsString()
  @IsNotEmpty()
  puzzleId: string;
}