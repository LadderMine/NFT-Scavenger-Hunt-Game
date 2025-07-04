import { IsString, IsArray, IsOptional, IsNumber } from 'class-validator';

export class SubmitAnswerDto {
  @IsString()
  questionId: string;

  @IsArray()
  @IsString({ each: true })
  selectedOptionIds: string[];
}

export class SubmitQuizDto {
  @IsString()
  quizId: string;

  @IsArray()
  answers: SubmitAnswerDto[];

  @IsOptional()
  @IsNumber()
  timeTaken?: number; // in seconds
}
