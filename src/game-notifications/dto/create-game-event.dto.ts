import { IsEnum, IsString, IsUUID, IsOptional, IsObject, IsIn } from "class-validator"
import { GameEventType } from "../entities/game-event.entity"

export class CreateGameEventDto {
  @IsEnum(GameEventType)
  eventType: GameEventType

  @IsString()
  title: string

  @IsString()
  description: string

  @IsUUID()
  userId: string

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>

  @IsOptional()
  @IsIn(["low", "medium", "high", "urgent"])
  priority?: "low" | "medium" | "high" | "urgent"
}
