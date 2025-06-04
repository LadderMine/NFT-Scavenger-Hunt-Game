import { Controller, Post, Get, Body, Param, Query, ParseUUIDPipe } from "@nestjs/common"
import type { GameEventService } from "../services/game-event.service"
import type { CreateGameEventDto } from "../dto/create-game-event.dto"
import type { GameEvent, GameEventType } from "../entities/game-event.entity"

@Controller("game-events")
export class GameEventController {
  constructor(private readonly gameEventService: GameEventService) {}

  @Post()
  async createGameEvent(@Body() createGameEventDto: CreateGameEventDto): Promise<GameEvent> {
    return this.gameEventService.createGameEvent(createGameEventDto);
  }

  @Get("user/:userId")
  async getGameEventsByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query('limit') limit?: number,
  ): Promise<GameEvent[]> {
    return this.gameEventService.getGameEventsByUser(userId, limit)
  }

  @Get("type/:eventType")
  async getGameEventsByType(
    @Param('eventType') eventType: GameEventType,
    @Query('limit') limit?: number,
  ): Promise<GameEvent[]> {
    return this.gameEventService.getGameEventsByType(eventType, limit)
  }

  @Get("unprocessed")
  async getUnprocessedEvents(): Promise<GameEvent[]> {
    return this.gameEventService.getUnprocessedEvents()
  }
}
