import { ApiProperty } from '@nestjs/swagger';

export class PlayerAchievementDto {
  @ApiProperty({
    description: 'Unique identifier for the player achievement record',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Unique identifier for the achievement',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  achievementId: string;

  @ApiProperty({
    description: 'Title of the achievement',
    example: 'Speed Demon',
  })
  title: string;

  @ApiProperty({
    description: 'Description of the achievement',
    example: 'Complete a puzzle in under 30 seconds',
  })
  description: string;

  @ApiProperty({
    description: 'URL to the achievement icon',
    example: 'https://example.com/icons/speed-demon.png',
  })
  iconUrl: string;

  @ApiProperty({
    description: 'Date and time when the achievement was earned',
    example: '2024-01-15T10:30:00Z',
  })
  earnedAt: Date;
}
