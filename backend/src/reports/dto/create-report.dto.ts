import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReportDto {
  @IsNumber()
  puzzleId: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
