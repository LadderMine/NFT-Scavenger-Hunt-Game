// src/achievements/services/achievement.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerAchievement } from './entities/player-achievements.entity';
import { Achievement, RuleType } from './entities/achievement.entity';

export interface GameEvent {
  playerId: string;
  eventType: 'puzzle_completed' | 'player_login' | 'game_session_start';
  metadata?: {
    completionTime?: number; // in seconds
    puzzleId?: string;
    loginDate?: string; // YYYY-MM-DD format
    consecutiveDays?: number;
    totalPuzzlesCompleted?: number;
  };
}

@Injectable()
export class AchievementService {
  private readonly logger = new Logger(AchievementService.name);

  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    @InjectRepository(PlayerAchievement)
    private playerAchievementRepository: Repository<PlayerAchievement>,
  ) {}

  async getPlayerAchievements(playerId: string): Promise<PlayerAchievement[]> {
    return this.playerAchievementRepository.find({
      where: { playerId },
      relations: ['achievement'],
      order: { earnedAt: 'DESC' },
    });
  }

  async processGameEvent(event: GameEvent): Promise<void> {
    this.logger.log(
      `Processing game event: ${event.eventType} for player: ${event.playerId}`,
    );

    const achievements = await this.achievementRepository.find();

    for (const achievement of achievements) {
      if (await this.shouldAwardAchievement(achievement, event)) {
        await this.awardAchievement(event.playerId, achievement.id);
      }
    }
  }

  private async shouldAwardAchievement(
    achievement: Achievement,
    event: GameEvent,
  ): Promise<boolean> {
    // Check if player already has this achievement
    const existingAchievement = await this.playerAchievementRepository.findOne({
      where: {
        playerId: event.playerId,
        achievementId: achievement.id,
      },
    });

    if (existingAchievement) {
      return false; // Already earned
    }

    // Evaluate based on rule type
    switch (achievement.ruleType) {
      case RuleType.PUZZLE_COMPLETION_TIME:
        return this.evaluatePuzzleTimeRule(achievement, event);

      case RuleType.LOGIN_STREAK:
        return this.evaluateLoginStreakRule(achievement, event);

      case RuleType.TOTAL_PUZZLES_COMPLETED:
        return this.evaluateTotalPuzzlesRule(achievement, event);

      case RuleType.FIRST_PUZZLE:
        return this.evaluateFirstPuzzleRule(achievement, event);

      case RuleType.DAILY_LOGIN:
        return this.evaluateDailyLoginRule(achievement, event);

      default:
        return false;
    }
  }

  private evaluatePuzzleTimeRule(
    achievement: Achievement,
    event: GameEvent,
  ): boolean {
    if (
      event.eventType !== 'puzzle_completed' ||
      !event.metadata?.completionTime
    ) {
      return false;
    }

    const { maxTime } = achievement.ruleValue;
    return event.metadata.completionTime <= maxTime;
  }

  private evaluateLoginStreakRule(
    achievement: Achievement,
    event: GameEvent,
  ): boolean {
    if (
      event.eventType !== 'player_login' ||
      !event.metadata?.consecutiveDays
    ) {
      return false;
    }

    const { requiredDays } = achievement.ruleValue;
    return event.metadata.consecutiveDays >= requiredDays;
  }

  private evaluateTotalPuzzlesRule(
    achievement: Achievement,
    event: GameEvent,
  ): boolean {
    if (
      event.eventType !== 'puzzle_completed' ||
      !event.metadata?.totalPuzzlesCompleted
    ) {
      return false;
    }

    const { requiredTotal } = achievement.ruleValue;
    return event.metadata.totalPuzzlesCompleted >= requiredTotal;
  }

  private evaluateFirstPuzzleRule(
    achievement: Achievement,
    event: GameEvent,
  ): boolean {
    if (event.eventType !== 'puzzle_completed') {
      return false;
    }

    const { isFirstPuzzle } = achievement.ruleValue;
    return isFirstPuzzle && event.metadata?.totalPuzzlesCompleted === 1;
  }

  private evaluateDailyLoginRule(
    achievement: Achievement,
    event: GameEvent,
  ): boolean {
    if (event.eventType !== 'player_login') {
      return false;
    }

    // This rule is triggered on any daily login
    return true;
  }

  private async awardAchievement(
    playerId: string,
    achievementId: string,
  ): Promise<void> {
    try {
      const playerAchievement = this.playerAchievementRepository.create({
        playerId,
        achievementId,
      });

      await this.playerAchievementRepository.save(playerAchievement);

      this.logger.log(
        `Achievement ${achievementId} awarded to player ${playerId}`,
      );
    } catch (error) {
      if (error.code === '23505') {
        // Unique constraint violation
        this.logger.warn(
          `Achievement ${achievementId} already exists for player ${playerId}`,
        );
      } else {
        this.logger.error(`Failed to award achievement: ${error.message}`);
        throw error;
      }
    }
  }

  async initializeDefaultAchievements(): Promise<void> {
    const defaultAchievements = [
      {
        title: 'Speed Demon',
        description: 'Complete a puzzle in under 30 seconds',
        iconUrl: 'https://example.com/icons/speed-demon.png',
        ruleType: RuleType.PUZZLE_COMPLETION_TIME,
        ruleValue: { maxTime: 30 },
      },
      {
        title: 'Dedication',
        description: 'Log in for 7 consecutive days',
        iconUrl: 'https://example.com/icons/dedication.png',
        ruleType: RuleType.LOGIN_STREAK,
        ruleValue: { requiredDays: 7 },
      },
      {
        title: 'First Steps',
        description: 'Complete your first puzzle',
        iconUrl: 'https://example.com/icons/first-steps.png',
        ruleType: RuleType.FIRST_PUZZLE,
        ruleValue: { isFirstPuzzle: true },
      },
      {
        title: 'Puzzle Master',
        description: 'Complete 100 puzzles',
        iconUrl: 'https://example.com/icons/puzzle-master.png',
        ruleType: RuleType.TOTAL_PUZZLES_COMPLETED,
        ruleValue: { requiredTotal: 100 },
      },
    ];

    for (const achievementData of defaultAchievements) {
      const existing = await this.achievementRepository.findOne({
        where: { title: achievementData.title },
      });

      if (!existing) {
        const achievement = this.achievementRepository.create(achievementData);
        await this.achievementRepository.save(achievement);
        this.logger.log(
          `Created default achievement: ${achievementData.title}`,
        );
      }
    }
  }
}
