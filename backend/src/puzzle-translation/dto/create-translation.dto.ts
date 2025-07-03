import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTranslationDto {
  @IsNotEmpty()
  @IsString()
  puzzleId: string;

  @IsString()
  language: string;

  @IsString()
  title: string;

  @IsString()
  description: string;
} 