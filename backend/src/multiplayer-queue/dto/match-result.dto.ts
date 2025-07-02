import { ApiProperty } from "@nestjs/swagger"
import { MatchStatus } from "../entities/match.entity"

export class MatchResultDto {
  @ApiProperty({
    description: "Match ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  matchId: string

  @ApiProperty({
    description: "Matched player IDs",
    example: ["456e7890-e89b-12d3-a456-426614174001", "789e0123-e89b-12d3-a456-426614174002"],
  })
  playerIds: string[]

  @ApiProperty({
    description: "Matched player usernames",
    example: ["player1", "player2"],
  })
  playerUsernames: string[]

  @ApiProperty({
    description: "Match status",
    enum: MatchStatus,
    example: MatchStatus.PENDING,
  })
  status: MatchStatus

  @ApiProperty({
    description: "Game mode",
    example: "classic",
  })
  gameMode: string

  @ApiProperty({
    description: "Skill level of the match",
    example: "intermediate",
  })
  skillLevel: string

  @ApiProperty({
    description: "Average wait time of matched players",
    example: 67,
  })
  averageWaitTime: number

  @ApiProperty({
    description: "Match creation timestamp",
    example: "2024-01-15T10:32:15Z",
  })
  createdAt: Date
}
