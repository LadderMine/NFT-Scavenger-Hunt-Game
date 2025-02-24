import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLevelDto {
  @ApiProperty({ description: 'The name of the level' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The description of the level' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'The difficulty of the level' })
  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @ApiProperty({ description: 'The required score to unlock this level' })
  @IsNumber()
  @IsOptional()
  requiredScore?: number;

  @ApiProperty({ description: 'Whether the level is locked' })
  @IsBoolean()
  @IsOptional()
  isLocked?: boolean;
}