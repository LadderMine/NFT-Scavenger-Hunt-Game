import { ApiProperty } from '@nestjs/swagger';

export class FeedbackResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  challengeId: string;

  @ApiProperty({ example: 4 })
  rating: number;

  @ApiProperty({ example: 'This challenge was engaging and well-designed.' })
  comment: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  timestamp: Date;
}

export class FeedbackStatsDto {
  @ApiProperty({ example: 4.2 })
  averageRating: number;

  @ApiProperty({ example: 15 })
  totalFeedbacks: number;

  @ApiProperty({ example: { 1: 0, 2: 1, 3: 2, 4: 7, 5: 5 } })
  ratingDistribution: Record<number, number>;
}
