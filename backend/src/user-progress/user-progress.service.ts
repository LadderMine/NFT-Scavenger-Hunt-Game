import { Injectable, NotFoundException,  BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import type { Hints } from '../hints/hints.entity';
import { UserProgress } from './user-progress.entity';
import { UsersService } from 'src/users/users.service';
import { PuzzlesService } from 'src/puzzles/puzzles.service';
import { HintsService } from 'src/hints/hints.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProgress } from './user-progress.entity';
import { UserProgressDto } from './dto/user-progress.dto';
import { LevelProgressService } from './level-progress.service';
import { UsersService } from 'src/users/users.service';
import { PuzzlesService } from 'src/puzzles/puzzles.service';
import { HintsService } from 'src/hints/hints.service';
import { Puzzles } from 'src/puzzles/puzzles.entity';
import { Level } from 'src/level/entities/level.entity';

@Injectable()
export class UserProgressService {
  constructor(
    @InjectRepository(UserProgress)
    private userProgressRepository: Repository<UserProgress>,
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
    // Dependency injection for user service
    private readonly userservice: UsersService,

    private readonly puzzleservice: PuzzlesService,

    private readonly hintservice: HintsService,
  ) {}

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    const progress = await this.userProgressRepository.find({
      where: { user: { id: userId } },
      relations: ['puzzles', 'hints'],
    });

    if (!progress.length) {
      throw new NotFoundException(`No progress found for user ${userId}`);
    }

    return progress;
  }

  async updateProgress(
    userId: number,
    puzzleId: number,
    hintId: number | null,
    completed: boolean,
  ): Promise<UserProgress> {
    let progress = await this.userProgressRepository.findOne({
      where: { user: { id: userId }, puzzles: { id: puzzleId } },
    });

    if (!progress) {
      progress = this.userProgressRepository.create({
        user: { id: userId },
        puzzles: { id: puzzleId },
      });
    levelId: string,
    hintId: number | null = null,
  ): Promise<{
    userProgress: UserProgress;
    levelProgress: { progress: number; solved: number; total: number };
  }> {
    // Validate inputs
    if (!userId || !puzzleId || !levelId) {
      throw new BadRequestException('Missing required parameters');
    }

    // Verify puzzle exists and belongs to the specified level
    const puzzle = await this.puzzlesService.getAPuzzle(puzzleId);
    if (!puzzle) {
      throw new NotFoundException(`Puzzle with ID ${puzzleId} not found`);
    }
    if (puzzle.level.id !== levelId) {
      throw new BadRequestException(
        `Puzzle ${puzzleId} does not belong to level ${levelId}`,
      );
    }

    // 1. Update puzzle completion status
    let progress = await this.userProgressRepository.findOne({
      where: { user: { id: userId }, puzzles: { id: puzzleId } },
      relations: ['puzzles', 'hints', 'user'],
    });

    if (!progress) {
      const newProgress = new UserProgress();
      newProgress.user = { id: userId } as any;
      newProgress.puzzles = [{ id: puzzleId } as Puzzles];
      newProgress.completed = true;
      progress = newProgress;
    } else {
      progress.completed = true;
    }

    // 2. Update hint usage if a hint was used
    if (hintId) {
      progress.hints = { id: hintId } as Hints;
      progress.hintsUsed += 1;
      // Verify hint exists and belongs to the puzzle
      const hint = await this.hintsService.findById(String(hintId));
      if (!hint) {
        throw new NotFoundException(`Hint with ID ${hintId} not found`);
      }
      if (hint.puzzles.id !== puzzleId) {
        throw new BadRequestException(
          `Hint ${hintId} does not belong to puzzle ${puzzleId}`,
        );
      }

      progress.hints = hint;
      progress.hintsUsed += 1;
    }

    progress.lastUpdated = new Date();

    try {
      // 3. Save the progress
      const savedProgress = await this.userProgressRepository.save(progress);

      // 4. Calculate level completion progress
      const levelProgress =
        await this.levelProgressService.calculateLevelCompletion(
          userId,
          levelId,
        );

      // 5. Check if level is completed (100% progress)
      if (levelProgress.progress === 100) {
        await this.handleLevelCompletion(userId, levelId);
      }

      return {
        userProgress: savedProgress,
        levelProgress,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to update progress: ${error.message}`,
      );
    }
  }

  private async handleLevelCompletion(
    userId: number,
    levelId: string,
  ): Promise<void> {
    try {
      // Get user's current progress
      const userProgress = await this.getUserProgress(userId);
      const completedPuzzles = userProgress.filter((p) => p.completed).length;
      const hintsUsed = userProgress.reduce(
        (total, p) => total + p.hintsUsed,
        0,
      );

    progress.completed = completed;
    progress.lastUpdated = new Date();

    return this.userProgressRepository.save(progress);
  }

  async getUserScore(userId: number): Promise<number> {
    const progress = await this.userProgressRepository.find({
      where: { user: { id: userId }, completed: true },
      relations: ['puzzle'],
    });

    return progress.reduce((total, p) => total + p.puzzles.pointValue, 0);
  }

  async puzzleCompleted(
    userId: number,
    puzzleId: number,
  ): Promise<UserProgress> {

    const progress = await this.updateProgress(userId, puzzleId, null, true);
    
    await this.recalcOverallProgress(progress);
    return this.userProgressRepository.save(progress);
  }

  async levelCompleted(userId: number, levelId: number): Promise<UserProgress> {
  
    let progress = await this.userProgressRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!progress) {
      progress = this.userProgressRepository.create({ user: { id: userId } });
    }
    if (!progress.completedLevels) {
      progress.completedLevels = [];
    }
    if (!progress.completedLevels.includes(levelId)) {
      progress.completedLevels.push(levelId);
    }

    await this.recalcOverallProgress(progress);
    progress.lastUpdated = new Date();
    return this.userProgressRepository.save(progress);
  }

  private async recalcOverallProgress(progress: UserProgress): Promise<void> {
    const totalPuzzles = await this.puzzleservice.getTotalPuzzles();
    const totalLevels = await this.puzzleservice.getTotalLevels();

    const puzzleProgress = progress.completed ? 100 : 0;

    const levelProgress =
      totalLevels && progress.completedLevels
        ? (progress.completedLevels.length / totalLevels) * 100
        : 0;

    

    progress.progressPercentage = Math.round(
      (puzzleProgress + levelProgress) / 2,

    );
  }
}
