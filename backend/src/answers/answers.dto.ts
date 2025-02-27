import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAnswerDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  puzzleId: number;

  @IsOptional()
  hintId?: number;
}

export class UpdateAnswerDto extends PartialType(CreateAnswerDto) {}
