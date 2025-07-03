import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckEligibilityDto {
  @ApiProperty({ description: 'User ID to check eligibility for' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Puzzle ID to check eligibility for' })
  @IsString()
  @IsNotEmpty()
  puzzleId: string;
}