import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePuzzleDependencyDto {
  @ApiProperty({ description: 'ID of the puzzle that has dependencies' })
  @IsString()
  @IsNotEmpty()
  puzzleId: string;

  @ApiProperty({ description: 'ID of the puzzle that must be completed first' })
  @IsString()
  @IsNotEmpty()
  dependsOnPuzzleId: string;

  @ApiProperty({ description: 'Whether this dependency is required', default: true })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @ApiProperty({ description: 'Optional description of the dependency', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}