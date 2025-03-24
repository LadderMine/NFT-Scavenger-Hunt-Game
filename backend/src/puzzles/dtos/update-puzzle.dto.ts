import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LevelEnum } from 'src/enums/LevelEnum';

export class UpdatePuzzleDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsEnum(LevelEnum, { message: 'difficulty must be EASY, MEDIUM, DIFFICULT, or ADVANCED' })
  difficulty?: LevelEnum;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  solution?: string;
}
