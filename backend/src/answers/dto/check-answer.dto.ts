import { IsNotEmpty, IsString } from 'class-validator';


export class CheckAnswerDto {
  @IsString()
  @IsNotEmpty()
  puzzleId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}