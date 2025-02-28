import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import type { Hints } from '../hints/hints.entity';
import { UserProgress } from './user-progress.entity';
import { UsersService } from 'src/users/users.service';
import { PuzzlesService } from 'src/puzzles/puzzles.service';
import { HintsService } from 'src/hints/hints.service';

@Injectable()
export class UserProgressService {
  constructor(
    @InjectRepository(UserProgress)
    private userProgressRepository: Repository<UserProgress>,

    // Dependency injection for user service
    private readonly userservice: UsersService,

    // Dependency injection for puzzle service
    private readonly puzzleservice: PuzzlesService,

    // Dependency injection for hint service
    private readonly hintservice: HintsService,
  ) {}

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return this.userProgressRepository.find({
      where: { user: { id: userId } },
      relations: ['puzzles', 'hints'],
    });
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
    }

    if (hintId) {
      progress.hints = { id: hintId } as Hints;
      progress.hintsUsed += 1;
    }

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

  // ── NEW METHOD: Puzzle Completed ───────────────────────────────
  /**
   * Called when a user answers a new puzzle.
   * - Updates the puzzle completion status using updateProgress.
   * - Triggers a recalculation of overall progress.
   * - Persists the updated UserProgress entity.
   */
  async puzzleCompleted(
    userId: number,
    puzzleId: number,
  ): Promise<UserProgress> {
    // Update puzzle status (assumes 'completed' flag true means the puzzle is solved)
    const progress = await this.updateProgress(userId, puzzleId, null, true);
    // Recalculate overall progress (which includes revalidating total puzzles solved)
    await this.recalcOverallProgress(progress);
    return this.userProgressRepository.save(progress);
  }

  // ── NEW METHOD: Level Completed ────────────────────────────────
  /**
   * Called when the number of puzzles solved in a level changes.
   * - Updates the level completion status.
   * - Recalculates the completion percentage for that level.
   * - Persists the changes immediately.
   */
  async levelCompleted(userId: number, levelId: number): Promise<UserProgress> {
    // Retrieve the user's progress record (assumes one progress record per user)
    let progress = await this.userProgressRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!progress) {
      // If no progress exists, create one
      progress = this.userProgressRepository.create({ user: { id: userId } });
    }

    // Ensure the completedLevels array exists
    if (!progress.completedLevels) {
      progress.completedLevels = [];
    }
    // If the level isn't already marked as completed, add it
    if (!progress.completedLevels.includes(levelId)) {
      progress.completedLevels.push(levelId);
    }

    // Recalculate overall progress, which now takes into account level progress
    await this.recalcOverallProgress(progress);
    progress.lastUpdated = new Date();
    return this.userProgressRepository.save(progress);
  }

  // ── PRIVATE HELPER METHOD: Recalculate Overall Progress ──────────
  /**
   * Recalculates overall progress by combining puzzle and level progress.
   * Assumes that:
   * - puzzleservice.getTotalPuzzles() returns the total number of puzzles.
   * - puzzleservice.getTotalLevels() returns the total number of levels.
   * - For puzzles: a completed puzzle is 100% done.
   * - For levels: progress is calculated as the percentage of levels completed.
   */
  private async recalcOverallProgress(progress: UserProgress): Promise<void> {
    // Retrieve the latest totals (ensure these methods exist in PuzzlesService)
    const totalPuzzles = await this.puzzleservice.getTotalPuzzles();
    const totalLevels = await this.puzzleservice.getTotalLevels();

    // Calculate puzzle progress.
    // This example assumes that progress.completed is a flag for the current puzzle.
    // Adjust this if your entity tracks multiple puzzles.
    const puzzleProgress = progress.completed ? 100 : 0;

    // Calculate level progress. Assumes progress.completedLevels is an array of completed level IDs.
    const levelProgress =
      totalLevels && progress.completedLevels
        ? (progress.completedLevels.length / totalLevels) * 100
        : 0;

    // Combine both progress values (using an average in this example)
    progress.progressPercentage = Math.round(
      (puzzleProgress + levelProgress) / 2,
    );
  }
}
