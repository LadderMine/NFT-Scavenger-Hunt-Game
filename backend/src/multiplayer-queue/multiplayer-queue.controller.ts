import { Controller, Get, Post, Delete, Param, HttpCode, HttpStatus } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger"
import type { MultiplayerQueueService } from "./multiplayer-queue.service"
import type { JoinQueueDto } from "./dto/join-queue.dto"
import { QueueStatusDto } from "./dto/queue-status.dto"
import { MatchResultDto } from "./dto/match-result.dto"
import { QueueStatsDto } from "./dto/queue-stats.dto"

@ApiTags("Multiplayer Queue")
@Controller("multiplayer-queue")
export class MultiplayerQueueController {
  constructor(private readonly multiplayerQueueService: MultiplayerQueueService) {}

  @Post("join")
  @ApiOperation({ summary: "Join the multiplayer queue" })
  @ApiResponse({ status: 201, description: "Successfully joined queue", type: QueueStatusDto })
  @ApiResponse({ status: 400, description: "User already in queue or invalid data" })
  async joinQueue(joinQueueDto: JoinQueueDto): Promise<QueueStatusDto> {
    return await this.multiplayerQueueService.joinQueue(joinQueueDto)
  }

  @Delete("leave/:userId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Leave the multiplayer queue" })
  @ApiParam({ name: "userId", description: "User ID to remove from queue" })
  @ApiResponse({ status: 204, description: "Successfully left queue" })
  @ApiResponse({ status: 404, description: "User not found in queue" })
  async leaveQueue(@Param("userId") userId: string): Promise<void> {
    await this.multiplayerQueueService.leaveQueue(userId)
  }

  @Get("status/:userId")
  @ApiOperation({ summary: "Get queue status for a user" })
  @ApiParam({ name: "userId", description: "User ID to check status" })
  @ApiResponse({ status: 200, description: "Queue status retrieved", type: QueueStatusDto })
  @ApiResponse({ status: 404, description: "User not in queue" })
  async getQueueStatus(@Param("userId") userId: string): Promise<QueueStatusDto | null> {
    return await this.multiplayerQueueService.getQueueStatus(userId)
  }

  @Get("list")
  @ApiOperation({ summary: "Get all users currently in queue" })
  @ApiResponse({ status: 200, description: "Queue list retrieved", type: [QueueStatusDto] })
  async getQueueList(): Promise<QueueStatusDto[]> {
    return await this.multiplayerQueueService.getQueueList()
  }

  @Get("stats")
  @ApiOperation({ summary: "Get queue statistics" })
  @ApiResponse({ status: 200, description: "Queue statistics retrieved", type: QueueStatsDto })
  async getQueueStats(): Promise<QueueStatsDto> {
    return await this.multiplayerQueueService.getQueueStats()
  }

  @Get("match/:matchId")
  @ApiOperation({ summary: "Get match details" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({ status: 200, description: "Match details retrieved", type: MatchResultDto })
  @ApiResponse({ status: 404, description: "Match not found" })
  async getMatch(@Param("matchId") matchId: string): Promise<MatchResultDto> {
    return await this.multiplayerQueueService.getMatch(matchId)
  }

  @Post("process-matchmaking")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Manually trigger matchmaking process" })
  @ApiResponse({ status: 200, description: "Matchmaking process triggered" })
  async processMatchmaking(): Promise<{ message: string }> {
    await this.multiplayerQueueService.processMatchmaking()
    return { message: "Matchmaking process completed" }
  }
}
