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

export class UpdateStoryChapterDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
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
