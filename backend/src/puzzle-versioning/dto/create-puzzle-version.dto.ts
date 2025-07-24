
import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class CreatePuzzleVersionDto {
  @IsString()
  @IsOptional()
  puzzleId?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsObject()
  @IsNotEmpty()
  content: Record<string, any>;
}