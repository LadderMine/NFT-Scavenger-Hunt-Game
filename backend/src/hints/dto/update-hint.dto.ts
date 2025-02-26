import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class UpdateHintDto {
    @IsString()
    @IsNotEmpty()
    hintText: string;

    @IsOptional()
    @IsIn(['easy', 'medium', 'hard'], { message: 'Difficulty level must be either easy, medium, or hard.' })
    difficultyLevel?: string;
}
