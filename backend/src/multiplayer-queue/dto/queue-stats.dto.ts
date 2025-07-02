import { ApiProperty } from "@nestjs/swagger"

export class QueueStatsDto {
  @ApiProperty({
    description: "Total players currently in queue",
    example: 15,
  })
  totalInQueue: number

  @ApiProperty({
    description: "Players waiting by skill level",
    example: {
      beginner: 5,
      intermediate: 7,
      advanced: 2,
      expert: 1,
    },
  })
  bySkillLevel: Record<string, number>

  @ApiProperty({
    description: "Players waiting by game mode",
    example: {
      classic: 12,
      blitz: 3,
    },
  })
  byGameMode: Record<string, number>

  @ApiProperty({
    description: "Average wait time in seconds",
    example: 45.5,
  })
  averageWaitTime: number

  @ApiProperty({
    description: "Longest wait time in seconds",
    example: 120,
  })
  longestWaitTime: number

  @ApiProperty({
    description: "Total matches created today",
    example: 87,
  })
  matchesToday: number
}
