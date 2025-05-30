import { ApiProperty } from '@nestjs/swagger';

export class SkillProfileResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'Overall skill score (0-100)',
    example: 75.5,
  })
  skillScore: number;

  @ApiProperty({
    description: 'Completion rate percentage (0-100)',
    example: 85.2,
  })
  completionRate: number;

  @ApiProperty({
    description: 'Number of puzzles attempted',
    example: 20,
  })
  puzzlesAttempted: number;

  @ApiProperty({
    description: 'Number of puzzles completed',
    example: 17,
  })
  puzzlesCompleted: number;

  @ApiProperty({
    description: 'Skill score for easy puzzles',
    example: 95.0,
  })
  easySkillScore: number;

  @ApiProperty({
    description: 'Skill score for medium puzzles',
    example: 82.5,
  })
  mediumSkillScore: number;

  @ApiProperty({
    description: 'Skill score for difficult puzzles',
    example: 68.0,
  })
  difficultSkillScore: number;

  @ApiProperty({
    description: 'Skill score for advanced puzzles',
    example: 45.0,
  })
  advancedSkillScore: number;

  @ApiProperty({
    description: 'Last recommended difficulty level',
    example: 'MEDIUM',
  })
  lastRecommendedLevel: string;
}
