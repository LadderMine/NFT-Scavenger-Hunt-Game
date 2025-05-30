import { IsOptional, IsEnum, IsDateString, IsString, IsArray } from "class-validator"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { EventType } from "../enums/event-type.enum"
import { Transform } from "class-transformer"

export class EventAnalyticsQueryDto {
  @ApiPropertyOptional({
    description: "Filter by event types",
    enum: EventType,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(EventType, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  eventTypes?: EventType[]

  @ApiPropertyOptional({
    description: "Filter by user ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsOptional()
  @IsString()
  userId?: string

  @ApiPropertyOptional({
    description: "Start date for filtering events",
    example: "2024-01-01T00:00:00Z",
  })
  @IsOptional()
  @IsDateString()
  startDate?: string

  @ApiPropertyOptional({
    description: "End date for filtering events",
    example: "2024-12-31T23:59:59Z",
  })
  @IsOptional()
  @IsDateString()
  endDate?: string

  @ApiPropertyOptional({
    description: "Group results by time period",
    enum: ["hour", "day", "week", "month"],
    example: "day",
  })
  @IsOptional()
  @IsEnum(["hour", "day", "week", "month"])
  groupBy?: "hour" | "day" | "week" | "month"

  @ApiPropertyOptional({
    description: "Limit number of results",
    example: 100,
  })
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  limit?: number

  @ApiPropertyOptional({
    description: "Offset for pagination",
    example: 0,
  })
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  offset?: number
}
