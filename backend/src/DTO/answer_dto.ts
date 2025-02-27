import { IsNotEmpty, IsString, Length, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerDto {
    @IsNotEmpty({ message: 'Text must not be empty' })
    @IsString({ message: 'Text must be a string' })
    @Length(1, 500, { message: 'Text must be between 1 and 500 characters' })
    text: string;

    @IsNotEmpty({ message: 'UserId is required' })
    @IsInt({ message: 'UserId must be an integer' })
    @Type(() => Number)
    userId: number;

    @IsNotEmpty({ message: 'PuzzleId is required' })
    @IsInt({ message: 'PuzzleId must be an integer' })
    @Type(() => Number)
    puzzleId: number;

    @IsOptional()
    @IsInt({ message: 'HintId must be an integer' })
    @Type(() => Number)
    hintId?: number;
}