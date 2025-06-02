import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import {
  GameState,
  PuzzleProgress,
  TimerState,
  GameStatus,
  HintUsage,
} from './interfaces/game-state.interface';
import { CreateGameStateDto } from './dto/create-game-state.dto';
import { UpdateGameStateDto } from './dto/update-game-state.dto';
import { PuzzlesService } from '../puzzles/puzzles.service';
import { HintsService } from '../hints/hints.service';

@Injectable()
export class GameStateService {
  private readonly logger = new Logger(GameStateService.name);
  private readonly GAME_STATE_PREFIX = 'game_state';
  private readonly SESSION_PREFIX = 'session';
  private readonly DEFAULT_TTL = 24 * 60 * 60; // 24 hours in seconds

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly puzzlesService: PuzzlesService,
    private readonly hintsService: HintsService,
  ) {}

  /**
   * Create a new game state for a player
   */
  async createGameState(dto: CreateGameStateDto): Promise<GameState> {
    const sessionId = this.generateSessionId();
    const gameState: GameState = {
      playerId: dto.playerId,
      sessionId,
      currentPuzzleId: dto.currentPuzzleId,
      currentLevelId: dto.currentLevelId,
      puzzleProgress: [],
      timerState: {
        isActive: false,
        totalElapsed: 0,
      },
      hintsUsed: [],
      score: 0,
      lastActivity: new Date(),
      gameStatus: dto.gameStatus,
      metadata: {},
    };

    await this.saveGameState(gameState);
    this.logger.log(
      `Created game state for player ${dto.playerId} with session ${sessionId}`,
    );
    return gameState;
  }

  /**
   * Get current game state for a player
   */
  async getGameState(playerId: number): Promise<GameState | null> {
    const key = this.getGameStateKey(playerId);
    const data = await this.redis.get(key);

    if (!data) {
      return null;
    }

    try {
      const gameState = JSON.parse(data) as GameState;
      // Convert date strings back to Date objects
      gameState.lastActivity = new Date(gameState.lastActivity);
      gameState.puzzleProgress.forEach((progress) => {
        if (progress.startedAt)
          progress.startedAt = new Date(progress.startedAt);
        if (progress.completedAt)
          progress.completedAt = new Date(progress.completedAt);
      });
      gameState.hintsUsed.forEach((hint) => {
        hint.usedAt = new Date(hint.usedAt);
      });
      if (gameState.timerState.startTime) {
        gameState.timerState.startTime = new Date(
          gameState.timerState.startTime,
        );
      }
      if (gameState.timerState.pausedTime) {
        gameState.timerState.pausedTime = new Date(
          gameState.timerState.pausedTime,
        );
      }

      return gameState;
    } catch (error) {
      this.logger.error(
        `Failed to parse game state for player ${playerId}:`,
        error,
      );
      return null;
    }
  }

  /**
   * Update game state
   */
  async updateGameState(
    playerId: number,
    updates: UpdateGameStateDto,
  ): Promise<GameState> {
    const gameState = await this.getGameState(playerId);
    if (!gameState) {
      throw new NotFoundException(
        `Game state not found for player ${playerId}`,
      );
    }

    // Apply updates
    Object.assign(gameState, updates);
    gameState.lastActivity = new Date();

    await this.saveGameState(gameState);
    this.logger.log(`Updated game state for player ${playerId}`);
    return gameState;
  }

  /**
   * Start puzzle for a player
   */
  async startPuzzle(
    playerId: number,
    puzzleId: number,
    levelId: string,
  ): Promise<GameState> {
    const gameState = await this.getGameState(playerId);
    if (!gameState) {
      throw new NotFoundException(
        `Game state not found for player ${playerId}`,
      );
    }

    // Verify puzzle exists
    await this.puzzlesService.getAPuzzle(puzzleId);

    // Check if puzzle already exists in progress
    let puzzleProgress = gameState.puzzleProgress.find(
      (p) => p.puzzleId === puzzleId,
    );

    if (!puzzleProgress) {
      puzzleProgress = {
        puzzleId,
        levelId,
        status: 'in_progress',
        startedAt: new Date(),
        attempts: 1,
        timeSpent: 0,
        hintsUsed: 0,
      };
      gameState.puzzleProgress.push(puzzleProgress);
    } else {
      puzzleProgress.status = 'in_progress';
      puzzleProgress.attempts += 1;
    }

    gameState.currentPuzzleId = puzzleId;
    gameState.currentLevelId = levelId;
    gameState.gameStatus = GameStatus.ACTIVE;

    // Start timer
    gameState.timerState = {
      isActive: true,
      startTime: new Date(),
      totalElapsed: gameState.timerState.totalElapsed,
    };

    await this.saveGameState(gameState);
    this.logger.log(`Started puzzle ${puzzleId} for player ${playerId}`);
    return gameState;
  }

  /**
   * Complete puzzle for a player
   */
  async completePuzzle(
    playerId: number,
    puzzleId: number,
    score?: number,
  ): Promise<GameState> {
    const gameState = await this.getGameState(playerId);
    if (!gameState) {
      throw new NotFoundException(
        `Game state not found for player ${playerId}`,
      );
    }

    const puzzleProgress = gameState.puzzleProgress.find(
      (p) => p.puzzleId === puzzleId,
    );
    if (!puzzleProgress) {
      throw new NotFoundException(
        `Puzzle ${puzzleId} not found in player's progress`,
      );
    }

    // Update puzzle progress
    puzzleProgress.status = 'completed';
    puzzleProgress.completedAt = new Date();
    if (score !== undefined) {
      puzzleProgress.score = score;
      gameState.score += score;
    }

    // Update time spent
    if (gameState.timerState.isActive && gameState.timerState.startTime) {
      const timeSpent = Math.floor(
        (new Date().getTime() - gameState.timerState.startTime.getTime()) /
          1000,
      );
      puzzleProgress.timeSpent += timeSpent;
      gameState.timerState.totalElapsed += timeSpent;
    }

    // Stop timer
    gameState.timerState.isActive = false;
    gameState.timerState.startTime = undefined;

    await this.saveGameState(gameState);
    this.logger.log(`Completed puzzle ${puzzleId} for player ${playerId}`);
    return gameState;
  }

  /**
   * Use hint for a puzzle
   */
  async useHint(
    playerId: number,
    puzzleId: number,
    hintId: number,
  ): Promise<GameState> {
    const gameState = await this.getGameState(playerId);
    if (!gameState) {
      throw new NotFoundException(
        `Game state not found for player ${playerId}`,
      );
    }

    // Verify hint exists
    const hint = await this.hintsService.findById(hintId.toString());
    if (!hint) {
      throw new NotFoundException(`Hint ${hintId} not found`);
    }

    // Check if hint already used
    const alreadyUsed = gameState.hintsUsed.some(
      (h) => h.hintId === hintId && h.puzzleId === puzzleId,
    );
    if (alreadyUsed) {
      throw new Error('Hint already used for this puzzle');
    }

    // Add hint usage
    const hintUsage: HintUsage = {
      hintId,
      puzzleId,
      usedAt: new Date(),
      hintText: hint.text, // Changed from hint.hintText to hint.text
    };
    gameState.hintsUsed.push(hintUsage);

    // Update puzzle progress
    const puzzleProgress = gameState.puzzleProgress.find(
      (p) => p.puzzleId === puzzleId,
    );
    if (puzzleProgress) {
      puzzleProgress.hintsUsed += 1;
    }

    await this.saveGameState(gameState);
    this.logger.log(
      `Used hint ${hintId} for puzzle ${puzzleId} by player ${playerId}`,
    );
    return gameState;
  }

  /**
   * Pause/Resume timer
   */
  async toggleTimer(playerId: number): Promise<GameState> {
    const gameState = await this.getGameState(playerId);
    if (!gameState) {
      throw new NotFoundException(
        `Game state not found for player ${playerId}`,
      );
    }

    if (gameState.timerState.isActive) {
      // Pause timer
      if (gameState.timerState.startTime) {
        const elapsed = Math.floor(
          (new Date().getTime() - gameState.timerState.startTime.getTime()) /
            1000,
        );
        gameState.timerState.totalElapsed += elapsed;
      }
      gameState.timerState.isActive = false;
      gameState.timerState.pausedTime = new Date();
      gameState.gameStatus = GameStatus.PAUSED;
    } else {
      // Resume timer
      gameState.timerState.isActive = true;
      gameState.timerState.startTime = new Date();
      gameState.timerState.pausedTime = undefined;
      gameState.gameStatus = GameStatus.ACTIVE;
    }

    await this.saveGameState(gameState);
    this.logger.log(`Toggled timer for player ${playerId}`);
    return gameState;
  }

  /**
   * Delete game state
   */
  async deleteGameState(playerId: number): Promise<void> {
    const key = this.getGameStateKey(playerId);
    await this.redis.del(key);
    this.logger.log(`Deleted game state for player ${playerId}`);
  }

  /**
   * Get all active sessions (for monitoring)
   */
  async getActiveSessions(): Promise<string[]> {
    const pattern = `${this.GAME_STATE_PREFIX}:*`;
    return await this.redis.keys(pattern);
  }

  /**
   * Health check for Redis connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.redis.ping();
      return true;
    } catch (error) {
      this.logger.error('Redis health check failed:', error);
      return false;
    }
  }

  // Private helper methods
  private async saveGameState(gameState: GameState): Promise<void> {
    const key = this.getGameStateKey(gameState.playerId);
    const data = JSON.stringify(gameState);
    await this.redis.setex(key, this.DEFAULT_TTL, data);
  }

  private getGameStateKey(playerId: number): string {
    return `${this.GAME_STATE_PREFIX}:${playerId}`;
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
