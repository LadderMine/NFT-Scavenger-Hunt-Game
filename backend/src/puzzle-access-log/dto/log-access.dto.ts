import { IsString, IsNotEmpty } from 'class-validator';

export class LogAccessDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  puzzleId: string;
}