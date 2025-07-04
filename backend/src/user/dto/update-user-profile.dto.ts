import { IsOptional, IsString, MaxLength, IsUrl } from 'class-validator';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  bio?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
