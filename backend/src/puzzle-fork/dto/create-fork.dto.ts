
import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateForkDto {
  @IsString()
  @IsNotEmpty()
  originalPuzzleId: string;

  
  @IsInt()
  @IsOptional()
  version?: number;

  
  @IsString()
  @IsOptional()
  newTitle?: string;
}