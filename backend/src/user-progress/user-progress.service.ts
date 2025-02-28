import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
    private readonly userProgressRepository: Repository<UserProgress>,
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
    private readonly levelProgressService: LevelProgressService,
    private readonly usersService: UsersService,
    private readonly puzzlesService: PuzzlesService,
    private readonly hintsService: HintsService,
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

      // Calculate completion metrics
      const completionMetrics = {
        userId,
        levelId,
        completedPuzzles,
        hintsUsed,
        completionDate: new Date(),
        // Add more metrics as needed
      };

      // Log completion metrics
      console.log('Level completion metrics:', completionMetrics);

      // Here you could:
      // 1. Emit an event for level completion
      // 2. Update user achievements
      // 3. Grant rewards
      // 4. Update leaderboard
      // 5. Send notifications
    } catch (error) {
      console.error(
        `Error handling level completion for user ${userId} level ${levelId}:`,
        error,
      );
    }
  }

  async getUserScore(userId: number): Promise<number> {
    try {
      const progress = await this.userProgressRepository.find({
        where: { user: { id: userId }, completed: true },
        relations: ['puzzles'],
      });

      if (!progress.length) {
        return 0;
      }

      return progress.reduce(
        (total, p) => total + (p.puzzles[0]?.pointValue || 0),
        0,
      );
    } catch (error) {
      throw new BadRequestException(
        `Failed to calculate user score: ${error.message}`,
      );
    }
  }

  async getSolvedPuzzlesInLevel(
    userId: number,
    levelId: string,
  ): Promise<{ puzzles: Puzzles[]; count: number }> {
    try {
      return await this.levelProgressService.getPuzzlesSolvedPerLevel(
        userId,
        levelId,
      );
    } catch (error) {
      throw new NotFoundException(
        `Failed to get solved puzzles: ${error.message}`,
      );
    }
  }

  async getLevelProgress(
    userId: number,
    levelId: string,
  ): Promise<{ progress: number; solved: number; total: number }> {
    try {
      return await this.levelProgressService.calculateLevelCompletion(
        userId,
        levelId,
      );
    } catch (error) {
      throw new NotFoundException(
        `Failed to get level progress: ${error.message}`,
      );
    }
  }
}
