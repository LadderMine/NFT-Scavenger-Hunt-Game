import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsObject,
} from 'class-validator';
import { RewardType } from '../entities/reward.entity';

export class CreateRewardDto {
  @ApiProperty({
    description: 'Name of the reward',
    example: 'StarkNet Beginner Badge',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the reward',
    example: 'Awarded for completing the Easy level challenges',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Type of reward',
    enum: RewardType,
    example: RewardType.BADGE,
  })
  @IsEnum(RewardType)
  type: RewardType;

  @ApiProperty({
    description: 'Metadata for the reward',
    example: { imageUrl: 'https://example.com/badge.png', rarity: 'common' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Challenge ID associated with this reward',
    example: 'challenge-easy-001',
  })
  @IsString()
  @IsNotEmpty()
  challengeId: string;

  @ApiProperty({
    description: 'Whether the reward is currently active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description:
      'Maximum number of times this reward can be claimed (null for unlimited)',
    example: 1000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  maxClaims?: number | null;
}
