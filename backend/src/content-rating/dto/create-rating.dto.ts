import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateRatingDto {
  @IsString()
  userId: string;

  @IsString()
  contentId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
