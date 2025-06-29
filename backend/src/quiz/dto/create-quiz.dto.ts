import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from '../enums/question-type.enum';

export class CreateQuizOptionDto {
  @IsString()
  text: string;

  @IsBoolean()
  isCorrect: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsString()
  explanation?: string;
}

export class CreateQuizQuestionDto {
  @IsString()
  question: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsOptional()
  @IsNumber()
  @Min(1)
  points?: number;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuizOptionDto)
  options: CreateQuizOptionDto[];
}

export class CreateQuizDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  timeLimit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  passingScore?: number;

  @IsOptional()
  @IsBoolean()
  randomizeQuestions?: boolean;

  @IsOptional()
  @IsBoolean()
  randomizeOptions?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuizQuestionDto)
  questions: CreateQuizQuestionDto[];
}
