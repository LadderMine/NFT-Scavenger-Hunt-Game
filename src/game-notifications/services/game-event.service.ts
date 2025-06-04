import { Injectable, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { GameEvent, type GameEventType } from "../entities/game-event.entity"
import type { CreateGameEventDto } from "../dto/create-game-event.dto"
import type { NotificationService } from "./notification.service"

@Injectable()
export class GameEventService {
  private readonly logger = new Logger(GameEventService.name);

  constructor(
    private notificationService: NotificationService,
    @InjectRepository(GameEvent)
    private gameEventRepository: Repository<GameEvent>,
  ) {}

  async createGameEvent(createGameEventDto: CreateGameEventDto): Promise<GameEvent> {
    try {
      const gameEvent = this.gameEventRepository.create(createGameEventDto)
      const savedEvent = await this.gameEventRepository.save(gameEvent)

      this.logger.log(`Game event created: ${savedEvent.id} - ${savedEvent.eventType}`)

      // Process the event asynchronously
      this.processGameEvent(savedEvent)

      return savedEvent
    } catch (error) {
      this.logger.error(`Failed to create game event: ${error.message}`)
      throw error
    }
  }

  async getGameEventsByUser(userId: string, limit = 50): Promise<GameEvent[]> {
    return this.gameEventRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
      take: limit,
    })
  }

  async getGameEventsByType(eventType: GameEventType, limit = 50): Promise<GameEvent[]> {
    return this.gameEventRepository.find({
      where: { eventType },
      order: { createdAt: "DESC" },
      take: limit,
    })
  }

  private async processGameEvent(gameEvent: GameEvent): Promise<void> {
    try {
      // Create notification based on game event
      await this.notificationService.createNotificationFromGameEvent(gameEvent)

      // Mark event as processed
      await this.gameEventRepository.update(gameEvent.id, { processed: true })

      this.logger.log(`Game event processed: ${gameEvent.id}`)
    } catch (error) {
      this.logger.error(`Failed to process game event ${gameEvent.id}: ${error.message}`)
    }
  }

  async getUnprocessedEvents(): Promise<GameEvent[]> {
    return this.gameEventRepository.find({
      where: { processed: false },
      order: { createdAt: "ASC" },
    })
  }

  async markEventAsProcessed(eventId: string): Promise<void> {
    await this.gameEventRepository.update(eventId, { processed: true })
  }
}
