import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsUUID,
  IsUrl,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateChapterRequirementDto } from './create-chapter-requirement.dto';
import { CreateChapterRewardDto } from './create-chapter-reward.dto';

export class CreateStoryChapterDto {
  @IsString()
  title: string;

  @IsNumber()
  order: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFinalChapter?: boolean;

  @IsUUID()
  @IsOptional()
  previousChapterId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChapterRequirementDto)
  @IsOptional()
  requirements?: CreateChapterRequirementDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChapterRewardDto)
  @IsOptional()
  rewards?: CreateChapterRewardDto[];
}
