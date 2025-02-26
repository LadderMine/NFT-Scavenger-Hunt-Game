import { IsInt } from 'class-validator';

export class CreateRankDto {
  @IsInt()
  id: number;

  @IsInt()
  rank: number;

  @IsInt()
  totalPoints: number;
}
