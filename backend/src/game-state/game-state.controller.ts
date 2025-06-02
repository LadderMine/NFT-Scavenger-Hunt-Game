import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GameStateService } from './game-state.service';
import { CreateGameStateDto } from './dto/create-game-state.dto';
import { UpdateGameStateDto } from './dto/update-game-state.dto';
import { AuthTokenGuard } from '../auth/guard/auth-token/auth-token.guard';
import { GameState } from './interfaces/game-state.interface';

@ApiTags('Game State')
@Controller('game-state')
@UseGuards(AuthTokenGuard)
@ApiBearerAuth()
export class GameStateController {
  constructor(private readonly gameStateService: GameStateService) {}

  @Post()
  @ApiOperation({ summary: 'Create new game state for a player' })
  @ApiResponse({ status: 201, description: 'Game state created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createGameState(@Body() createGameStateDto: CreateGameStateDto): Promise<GameState> {
    return this.gameStateService.createGameState(createGameStateDto);
  }

  @Get(':playerId')
  @ApiOperation({ summary: 'Get current game state for a player' })
  @ApiParam({ name: 'playerId', description: 'Player ID' })
  @ApiResponse({ status: 200, description: 'Game state retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Game state not found' })
  async getGameState(@Param('playerId', ParseIntPipe) playerId: number): Promise<GameState | null> {
    return this.gameStateService.getGameState(playerId);
  }

  @Put(':playerId')
  @ApiOperation({ summary: 'Update game state for a player' })
  @ApiParam({ name: 'playerId', description: 'Player ID' })
  @ApiResponse({ status: 200, description: 'Game state updated successfully' })
  @ApiResponse({ status: 404, description: 'Game state not found' })
  async updateGameState(
    @Param('playerId', ParseIntPipe) playerId: number,
    @Body() updateGameStateDto: UpdateGameStateDto,
  ): Promise<GameState> {
    return this.gameStateService.updateGameState(playerId, updateGameStateDto);
  }

  @Post(':playerId/puzzle/:puzzleId/start')
  @ApiOperation({ summary: 'Start a puzzle for a player' })
  @ApiParam({ name: 'playerId', description: 'Player ID' })
  @ApiParam({ name: 'puzzleId', description: 'Puzzle ID' })
  @ApiResponse({ status: 200, description: 'Puzzle started successfully' })
  async startPuzzle(
    @Param('playerId', ParseIntPipe) playerId: number,
    @Param('puzzleId', ParseIntPipe) puzzleId: number,
    @Body('levelId') levelId: string,
  ): Promise<GameState> {
    return this.gameStateService.startPuzzle(playerId, puzzleId, levelId);
  }

  @Post(':playerId/puzzle/:puzzleId/complete')
  @ApiOperation({ summary: 'Complete a puzzle for a player' })
  @ApiParam({ name: 'playerId', description: 'Player ID' })
  @ApiParam({ name: 'puzzleId', description: 'Puzzle ID' })
  @ApiResponse({ status: 200, description: 'Puzzle completed successfully' })
  async completePuzzle(
    @Param('playerId', ParseIntPipe) playerId: number,
    @Param('puzzleId', ParseIntPipe) puzzleId: number,
    @Body('score') score?: number,
  ): Promise<GameState> {
    return this.gameStateService.completePuzzle(playerId, puzzleId, score);
  }

  @Post(':playerId/puzzle/:puzzleId/hint/:hintId')
  @ApiOperation({ summary: 'Use a hint for a puzzle' })
  @ApiParam({ name: 'playerId', description: 'Player ID' })
  @ApiParam({ name: 'puzzleId', description: 'Puzzle ID' })
  @ApiParam({ name: 'hintId', description: 'Hint ID' })
  @ApiResponse({ status: 200, description: 'Hint used successfully' })
  async useHint(
    @Param('playerId', ParseIntPipe) playerId: number,
    @Param('puzzleId', ParseIntPipe) puzzleId: number,
    @Param('hintId', ParseIntPipe) hintId: number,
  ): Promise<GameState> {
    return this.gameStateService.useHint(playerId, puzzleId, hintId);
  }

  @Post(':playerId/timer/toggle')
  @ApiOperation({ summary: 'Pause/Resume timer for a player' })
  @ApiParam({ name: 'playerId', description: 'Player ID' })
  @ApiResponse({ status: 200, description: 'Timer toggled successfully' })
  async toggleTimer(@Param('playerId', ParseIntPipe) playerId: number): Promise<GameState> {
    return this.gameStateService.toggleTimer(playerId);
  }

  @Delete(':playerId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete game state for a player' })
  @ApiParam({ name: 'playerId', description: 'Player ID' })
  @ApiResponse({ status: 204, description: 'Game state deleted successfully' })
  async deleteGameState(@Param('playerId', ParseIntPipe) playerId: number): Promise<void> {
    return this.gameStateService.deleteGameState(playerId);
  }

  @Get('admin/sessions')
  @ApiOperation({ summary: 'Get all active sessions (admin only)' })
  @ApiResponse({ status: 200, description: 'Active sessions retrieved successfully' })
  async getActiveSessions(): Promise<string[]> {
    return this.gameStateService.getActiveSessions();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check for Redis connection' })
  @ApiResponse({ status: 200, description: 'Redis connection is healthy' })
  async healthCheck(): Promise<{ status: string; redis: boolean }> {
    const redisHealthy = await this.gameStateService.healthCheck();
    return {
      status: redisHealthy ? 'healthy' : 'unhealthy',
      redis: redisHealthy,
    };
  }
}