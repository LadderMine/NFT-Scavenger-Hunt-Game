import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAchievementDto {
  @ApiProperty({ description: 'Display name of the achievement' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({ description: 'Optional description shown to the player', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
