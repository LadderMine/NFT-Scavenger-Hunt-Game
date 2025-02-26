import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateLeaderboardDto {
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsOptional()
  profile_picture?: string;

  @IsInt()
  @IsOptional()
  total_points?: number;

  @IsInt()
  @IsOptional()
  nfts_collected?: number;

  @IsInt()
  @IsOptional()
  challenges_completed?: number;

  @IsInt()
  @IsOptional()
  rank?: number;
}
