import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class RecommendationRequestDto {
  @ApiProperty({
    description: 'User ID to get recommendations for',
    example: 1,
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'Number of puzzle recommendations to return',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  count?: number;
}
