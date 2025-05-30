import { ApiProperty } from "@nestjs/swagger"
import { EventType } from "../enums/event-type.enum"

export class EventCountDto {
  @ApiProperty({ example: EventType.PUZZLE_OPENED })
  eventType: EventType

  @ApiProperty({ example: 150 })
  count: number

  @ApiProperty({ example: "2024-01-15" })
  date?: string
}

export class UserEventStatsDto {
  @ApiProperty({ example: 1250 })
  totalEvents: number

  @ApiProperty({ example: 45 })
  uniqueUsers: number

  @ApiProperty({ type: [EventCountDto] })
  eventCounts: EventCountDto[]

  @ApiProperty({ example: "2024-01-01T00:00:00Z" })
  periodStart: Date

  @ApiProperty({ example: "2024-01-31T23:59:59Z" })
  periodEnd: Date
}

export class TopUserDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  userId: string

  @ApiProperty({ example: "john_doe" })
  username: string

  @ApiProperty({ example: "john@example.com" })
  email: string

  @ApiProperty({ example: 89 })
  eventCount: number
}

export class EventAnalyticsResponseDto {
  @ApiProperty({ type: UserEventStatsDto })
  stats: UserEventStatsDto

  @ApiProperty({ type: [TopUserDto] })
  topUsers: TopUserDto[]

  @ApiProperty({ type: [EventCountDto] })
  timeSeriesData: EventCountDto[]
}
