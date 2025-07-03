import { ApiProperty } from "@nestjs/swagger"
import { QueueStatus, SkillLevel } from "../entities/queue.entity"

export class QueueStatusDto {
  @ApiProperty({
    description: "Queue entry ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string

  @ApiProperty({
    description: "User ID",
    example: "456e7890-e89b-12d3-a456-426614174001",
  })
  userId: string

  @ApiProperty({
    description: "Username",
    example: "player123",
  })
  username: string

  @ApiProperty({
    description: "Current queue status",
    enum: QueueStatus,
    example: QueueStatus.WAITING,
  })
  status: QueueStatus

  @ApiProperty({
    description: "Player's skill level",
    enum: SkillLevel,
    example: SkillLevel.INTERMEDIATE,
  })
  skillLevel: SkillLevel

  @ApiProperty({
    description: "Game mode",
    example: "classic",
  })
  gameMode: string

  @ApiProperty({
    description: "Current wait time in seconds",
    example: 45,
  })
  waitTime: number

  @ApiProperty({
    description: "Match ID if matched",
    example: "789e0123-e89b-12d3-a456-426614174002",
    nullable: true,
  })
  matchId: string | null

  @ApiProperty({
    description: "Queue join timestamp",
    example: "2024-01-15T10:30:00Z",
  })
  createdAt: Date

  @ApiProperty({
    description: "Match timestamp if matched",
    example: "2024-01-15T10:32:15Z",
    nullable: true,
  })
  matchedAt: Date | null
}
