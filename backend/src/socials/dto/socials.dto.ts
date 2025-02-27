import { IsNotEmpty, IsUUID, IsOptional, IsInt, Min } from 'class-validator';

export class FollowDto {
  @IsNotEmpty()
  @IsUUID()
  followingId: string;
}

export class FollowResponseDto {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export class UserDto {
  id: string;
  username: string;
  bio?: string;
  profilePicture?: string;
  isFollowing?: boolean;
  followersCount?: number;
  followingCount?: number;
}

export class ActivityDto {
  id: string;
  user: UserDto;
  type: string;
  data: any;
  createdAt: Date;
}

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
