import { IsEnum, IsOptional, IsString, IsObject, IsUUID } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { EventType } from "../enums/event-type.enum"

export class CreateUserEventDto {
  @ApiPropertyOptional({
    description: "User ID who performed the event",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsOptional()
  @IsUUID()
  userId?: string

  @ApiProperty({
    description: "Type of event that occurred",
    enum: EventType,
    example: EventType.PUZZLE_OPENED,
  })
  @IsEnum(EventType)
  eventType: EventType

  @ApiPropertyOptional({
    description: "Human-readable description of the event",
    example: "User opened puzzle: Ancient Riddle #1",
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({
    description: "Additional metadata about the event",
    example: {
      puzzleId: "456",
      difficulty: "hard",
      timeSpent: 120,
    },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>

  @ApiPropertyOptional({
    description: "IP address of the user",
    example: "192.168.1.1",
  })
  @IsOptional()
  @IsString()
  ipAddress?: string

  @ApiPropertyOptional({
    description: "User agent string",
    example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  })
  @IsOptional()
  @IsString()
  userAgent?: string

  @ApiPropertyOptional({
    description: "Session ID",
    example: "sess_123456789",
  })
  @IsOptional()
  @IsString()
  sessionId?: string
}
