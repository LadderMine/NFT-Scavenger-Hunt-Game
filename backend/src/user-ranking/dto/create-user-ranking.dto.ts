import { ApiProperty } from '@nestjs/swagger';

export class UserRankDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  score: number;

  @ApiProperty()
  achievements: number;

  @ApiProperty()
  activityPoints: number;

  @ApiProperty()
  rank: number;
}