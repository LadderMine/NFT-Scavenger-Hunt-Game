import { Injectable, NotFoundException, BadRequestException, Logger } from "@nestjs/common"
import { type Repository, MoreThan } from "typeorm"
import { Cron, CronExpression } from "@nestjs/schedule"
import { type Queue, QueueStatus, SkillLevel } from "./entities/queue.entity"
import type { Match } from "./entities/match.entity"
import type { JoinQueueDto } from "./dto/join-queue.dto"
import type { QueueStatusDto } from "./dto/queue-status.dto"
import type { MatchResultDto } from "./dto/match-result.dto"
import type { QueueStatsDto } from "./dto/queue-stats.dto"

@Injectable()
export class MultiplayerQueueService {
  private readonly logger = new Logger(MultiplayerQueueService.name)

  constructor(
    private readonly queueRepository: Repository<Queue>,
    private readonly matchRepository: Repository<Match>,
  ) {}

  /**
   * Join the multiplayer queue
   */
  async joinQueue(joinQueueDto: JoinQueueDto): Promise<QueueStatusDto> {
    // Check if user is already in queue
    const existingEntry = await this.queueRepository.findOne({
      where: {
        userId: joinQueueDto.userId,
        status: QueueStatus.WAITING,
      },
    })

    if (existingEntry) {
      throw new BadRequestException("User is already in queue")
    }

    // Create queue entry
    const queueEntry = this.queueRepository.create({
      userId: joinQueueDto.userId,
      username: joinQueueDto.username,
      skillLevel: joinQueueDto.skillLevel,
      gameMode: joinQueueDto.gameMode || "classic",
      preferences: {
        maxWaitTime: joinQueueDto.maxWaitTime,
        preferredOpponents: joinQueueDto.preferredOpponents,
        avoidOpponents: joinQueueDto.avoidOpponents,
      },
    })

    const savedEntry = await this.queueRepository.save(queueEntry)
    this.logger.log(`User ${joinQueueDto.username} joined queue`)

    // Try immediate matchmaking
    await this.processMatchmaking()

    return this.mapToQueueStatusDto(savedEntry)
  }

  /**
   * Leave the queue
   */
  async leaveQueue(userId: string): Promise<void> {
    const queueEntry = await this.queueRepository.findOne({
      where: {
        userId,
        status: QueueStatus.WAITING,
      },
    })

    if (!queueEntry) {
      throw new NotFoundException("User not found in queue")
    }

    queueEntry.status = QueueStatus.LEFT
    queueEntry.leftAt = new Date()
    await this.queueRepository.save(queueEntry)

    this.logger.log(`User ${queueEntry.username} left queue`)
  }

  /**
   * Get queue status for a user
   */
  async getQueueStatus(userId: string): Promise<QueueStatusDto | null> {
    const queueEntry = await this.queueRepository.findOne({
      where: {
        userId,
        status: QueueStatus.WAITING,
      },
    })

    if (!queueEntry) {
      return null
    }

    // Update wait time
    const waitTime = Math.floor((Date.now() - queueEntry.createdAt.getTime()) / 1000)
    queueEntry.waitTime = waitTime
    await this.queueRepository.save(queueEntry)

    return this.mapToQueueStatusDto(queueEntry)
  }

  /**
   * Get all users currently in queue
   */
  async getQueueList(): Promise<QueueStatusDto[]> {
    const queueEntries = await this.queueRepository.find({
      where: { status: QueueStatus.WAITING },
      order: { createdAt: "ASC" },
    })

    // Update wait times
    const now = Date.now()
    for (const entry of queueEntries) {
      entry.waitTime = Math.floor((now - entry.createdAt.getTime()) / 1000)
    }

    await this.queueRepository.save(queueEntries)

    return queueEntries.map((entry) => this.mapToQueueStatusDto(entry))
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(): Promise<QueueStatsDto> {
    const waitingEntries = await this.queueRepository.find({
      where: { status: QueueStatus.WAITING },
    })

    const now = Date.now()
    const waitTimes = waitingEntries.map((entry) => Math.floor((now - entry.createdAt.getTime()) / 1000))

    // Group by skill level
    const bySkillLevel: Record<string, number> = {}
    Object.values(SkillLevel).forEach((level) => {
      bySkillLevel[level] = 0
    })

    // Group by game mode
    const byGameMode: Record<string, number> = {}

    waitingEntries.forEach((entry) => {
      bySkillLevel[entry.skillLevel]++
      byGameMode[entry.gameMode] = (byGameMode[entry.gameMode] || 0) + 1
    })

    // Get matches created today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const matchesToday = await this.matchRepository.count({
      where: {
        createdAt: MoreThan(today),
      },
    })

    return {
      totalInQueue: waitingEntries.length,
      bySkillLevel,
      byGameMode,
      averageWaitTime: waitTimes.length > 0 ? waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length : 0,
      longestWaitTime: waitTimes.length > 0 ? Math.max(...waitTimes) : 0,
      matchesToday,
    }
  }

  /**
   * Get match details
   */
  async getMatch(matchId: string): Promise<MatchResultDto> {
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
    })

    if (!match) {
      throw new NotFoundException("Match not found")
    }

    return this.mapToMatchResultDto(match)
  }

  /**
   * Process matchmaking logic (runs periodically)
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  async processMatchmaking(): Promise<void> {
    const waitingPlayers = await this.queueRepository.find({
      where: { status: QueueStatus.WAITING },
      order: { createdAt: "ASC" },
    })

    if (waitingPlayers.length < 2) {
      return
    }

    this.logger.log(`Processing matchmaking for ${waitingPlayers.length} players`)

    // Group players by game mode and skill level
    const playerGroups = this.groupPlayersForMatching(waitingPlayers)

    for (const group of playerGroups) {
      if (group.length >= 2) {
        await this.createMatch(group.slice(0, 2)) // Match first 2 players
      }
    }
  }

  /**
   * Group players for optimal matching
   */
  private groupPlayersForMatching(players: Queue[]): Queue[][] {
    const groups: Record<string, Queue[]> = {}

    players.forEach((player) => {
      const key = `${player.gameMode}-${player.skillLevel}`
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(player)
    })

    // Also try cross-skill matching for players waiting too long
    const longWaitingPlayers = players.filter((p) => p.waitTime > 120) // 2 minutes
    if (longWaitingPlayers.length >= 2) {
      const crossSkillKey = `cross-skill-${longWaitingPlayers[0].gameMode}`
      groups[crossSkillKey] = longWaitingPlayers
    }

    return Object.values(groups)
  }

  /**
   * Create a match between players
   */
  private async createMatch(players: Queue[]): Promise<Match> {
    if (players.length < 2) {
      throw new BadRequestException("Need at least 2 players to create a match")
    }

    // Check preferences
    if (!this.checkPlayerCompatibility(players)) {
      this.logger.log("Players not compatible based on preferences")
      return null
    }

    const match = this.matchRepository.create({
      playerIds: players.map((p) => p.userId),
      playerUsernames: players.map((p) => p.username),
      gameMode: players[0].gameMode,
      skillLevel: players[0].skillLevel,
      averageWaitTime: Math.floor(players.reduce((sum, p) => sum + p.waitTime, 0) / players.length),
    })

    const savedMatch = await this.matchRepository.save(match)

    // Update queue entries
    for (const player of players) {
      player.status = QueueStatus.MATCHED
      player.matchId = savedMatch.id
      player.matchedAt = new Date()
    }

    await this.queueRepository.save(players)

    this.logger.log(`Created match ${savedMatch.id} with players: ${players.map((p) => p.username).join(", ")}`)

    return savedMatch
  }

  /**
   * Check if players are compatible based on preferences
   */
  private checkPlayerCompatibility(players: Queue[]): boolean {
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        const player1 = players[i]
        const player2 = players[j]

        // Check if player1 wants to avoid player2
        if (player1.preferences?.avoidOpponents?.includes(player2.userId)) {
          return false
        }

        // Check if player2 wants to avoid player1
        if (player2.preferences?.avoidOpponents?.includes(player1.userId)) {
          return false
        }
      }
    }

    return true
  }

  /**
   * Clean up old queue entries (runs daily)
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldEntries(): Promise<void> {
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)

    const result = await this.queueRepository.delete({
      createdAt: MoreThan(oneDayAgo),
      status: QueueStatus.LEFT,
    })

    this.logger.log(`Cleaned up ${result.affected} old queue entries`)
  }

  /**
   * Map Queue entity to DTO
   */
  private mapToQueueStatusDto(queue: Queue): QueueStatusDto {
    return {
      id: queue.id,
      userId: queue.userId,
      username: queue.username,
      status: queue.status,
      skillLevel: queue.skillLevel,
      gameMode: queue.gameMode,
      waitTime: queue.waitTime,
      matchId: queue.matchId,
      createdAt: queue.createdAt,
      matchedAt: queue.matchedAt,
    }
  }

  /**
   * Map Match entity to DTO
   */
  private mapToMatchResultDto(match: Match): MatchResultDto {
    return {
      matchId: match.id,
      playerIds: match.playerIds,
      playerUsernames: match.playerUsernames,
      status: match.status,
      gameMode: match.gameMode,
      skillLevel: match.skillLevel,
      averageWaitTime: match.averageWaitTime,
      createdAt: match.createdAt,
    }
  }
}
