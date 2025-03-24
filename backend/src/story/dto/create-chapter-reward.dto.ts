import { IsString, IsEnum, IsObject } from 'class-validator';
import { RewardType } from '../chapter-reward.entity';

export class CreateChapterRewardDto {
  @IsEnum(RewardType)
  type: RewardType;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsObject()
  data: Record<string, any>;
}
