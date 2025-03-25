import { IsString, IsEnum, IsObject } from 'class-validator';
import { RequirementType } from '../chapter-requirement.entity';

export class CreateChapterRequirementDto {
  @IsEnum(RequirementType)
  type: RequirementType;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsObject()
  data: Record<string, any>;
}
