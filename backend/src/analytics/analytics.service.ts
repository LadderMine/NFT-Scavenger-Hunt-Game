import { Injectable, Logger } from '@nestjs/common';

interface PuzzleStats {
  solveCount: number;
  totalSolveTime: number;
  attempts: number;
}

interface UserPuzzleEngagement {
  solveCount: number;
  totalSolveTime: number;
  attempts: number;
  lastSolved?: Date;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  private puzzleStats = new Map<string, PuzzleStats>();

  private userPuzzleHistory = new Map<
    string,
    Map<string, UserPuzzleEngagement>
  >();

  recordPuzzleSolve(userId: string, puzzleId: string, solveTime: number): void {
    this.logger.log(
      `Recording solve: User ${userId}, Puzzle ${puzzleId}, Time ${solveTime}`,
    );

    let currentPuzzleStats = this.puzzleStats.get(puzzleId);
    if (!currentPuzzleStats) {
      currentPuzzleStats = { solveCount: 0, totalSolveTime: 0, attempts: 0 };
    }
    currentPuzzleStats.solveCount++;
    currentPuzzleStats.totalSolveTime += solveTime;
    currentPuzzleStats.attempts++;
    this.puzzleStats.set(puzzleId, currentPuzzleStats);

    let currentUserPuzzles = this.userPuzzleHistory.get(userId);
    if (!currentUserPuzzles) {
      currentUserPuzzles = new Map<string, UserPuzzleEngagement>();
      this.userPuzzleHistory.set(userId, currentUserPuzzles);
    }

    let currentUserPuzzleStats = currentUserPuzzles.get(puzzleId);
    if (!currentUserPuzzleStats) {
      currentUserPuzzleStats = {
        solveCount: 0,
        totalSolveTime: 0,
        attempts: 0,
      };
    }
    currentUserPuzzleStats.solveCount++;
    currentUserPuzzleStats.totalSolveTime += solveTime;
    currentUserPuzzleStats.attempts++;
    currentUserPuzzleStats.lastSolved = new Date();
    currentUserPuzzles.set(puzzleId, currentUserPuzzleStats);

    this.logger.log(
      `Updated puzzle stats for ${puzzleId}: ${JSON.stringify(currentPuzzleStats)}`,
    );
    this.logger.log(
      `Updated user ${userId} puzzle history for ${puzzleId}: ${JSON.stringify(currentUserPuzzleStats)}`,
    );
  }

  getMostSolvedPuzzles(
    limit?: number,
  ): Array<{ puzzleId: string; solveCount: number }> {
    this.logger.log('Fetching most solved puzzles...');
    const sortedPuzzles = Array.from(this.puzzleStats.entries())
      .map(([puzzleId, stats]) => ({ puzzleId, solveCount: stats.solveCount }))
      .sort((a, b) => b.solveCount - a.solveCount);
    return limit ? sortedPuzzles.slice(0, limit) : sortedPuzzles;
  }

  getAverageSolveTime(puzzleId: string): number {
    this.logger.log(`Fetching average solve time for puzzle ${puzzleId}...`);
    const stats = this.puzzleStats.get(puzzleId);
    if (stats && stats.solveCount > 0) {
      return stats.totalSolveTime / stats.solveCount;
    }
    return 0;
  }

  getUserPuzzleStats(userId: string): Map<string, UserPuzzleEngagement> {
    this.logger.log(`Fetching puzzle history for user ${userId}...`);
    return (
      this.userPuzzleHistory.get(userId) ||
      new Map<string, UserPuzzleEngagement>()
    );
  }

  seedData(): void {
    this.logger.log('Seeding initial analytics data...');
    this.recordPuzzleSolve('user1', 'puzzleA', 120);
    this.recordPuzzleSolve('user1', 'puzzleB', 180);
    this.recordPuzzleSolve('user2', 'puzzleA', 150);
    this.recordPuzzleSolve('user1', 'puzzleA', 100);
    this.recordPuzzleSolve('user3', 'puzzleC', 200);
    this.recordPuzzleSolve('user2', 'puzzleB', 220);
    this.recordPuzzleSolve('user3', 'puzzleA', 90);
    this.recordPuzzleSolve('user1', 'puzzleC', 170);
    this.logger.log('Data seeding complete.');
  }
}
