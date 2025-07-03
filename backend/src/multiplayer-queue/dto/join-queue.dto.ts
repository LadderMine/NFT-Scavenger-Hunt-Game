import { IsString, IsNotEmpty, IsUUID, IsEnum, IsOptional, IsInt, Min, Max, IsArray } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { SkillLevel } from "../entities/queue.entity"

export class JoinQueueDto {
  @ApiProperty({
    description: "User ID joining the queue",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string

  @ApiProperty({
    description: "Username of the player",
    example: "player123",
  })
  @IsString()
  @IsNotEmpty()
  username: string

  @ApiProperty({
    description: "Player's skill level",
    enum: SkillLevel,
    example: SkillLevel.INTERMEDIATE,
  })
  @IsEnum(SkillLevel)
  skillLevel: SkillLevel

  @ApiPropertyOptional({
    description: "Game mode preference",
    example: "classic",
    default: "classic",
  })
  @IsString()
  @IsOptional()
  gameMode?: string = "classic"

  @ApiPropertyOptional({
    description: "Maximum wait time in seconds",
    example: 300,
    minimum: 30,
    maximum: 1800,
  })
  @IsInt()
  @Min(30)
  @Max(1800)
  @IsOptional()
  maxWaitTime?: number

  @ApiPropertyOptional({
    description: "Preferred opponents (user IDs)",
    example: ["456e7890-e89b-12d3-a456-426614174001"],
  })
  @IsArray()
  @IsUUID(4, { each: true })
  @IsOptional()
  preferredOpponents?: string[]

  @ApiPropertyOptional({
    description: "Opponents to avoid (user IDs)",
    example: ["789e0123-e89b-12d3-a456-426614174002"],
  })
  @IsArray()
  @IsUUID(4, { each: true })
  @IsOptional()
  avoidOpponents?: string[]
}
