import { ApiProperty } from "@nestjs/swagger"

export class LeaderboardEntryDto {
  @ApiProperty()
  userId: string

  @ApiProperty()
  username: string

  @ApiProperty()
  score: number

  @ApiProperty()
  puzzlesCompleted: number

  @ApiProperty()
  dailyStreak: number

  @ApiProperty()
  rank: number

  @ApiProperty({ required: false })
  country?: string
}

export class LeaderboardResponseDto {
  @ApiProperty({ type: [LeaderboardEntryDto] })
  entries: LeaderboardEntryDto[]

  @ApiProperty()
  total: number

  @ApiProperty()
  page: number

  @ApiProperty()
  limit: number

  @ApiProperty({ required: false })
  country?: string
}
