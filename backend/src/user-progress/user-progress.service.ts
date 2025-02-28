import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProgress } from './user-progress.entity';
import { UserProgressDto } from './dto/user-progress.dto';
import { LevelProgressService } from './level-progress.service';
import { UsersService } from 'src/users/users.service';
import { PuzzlesService } from 'src/puzzles/puzzles.service';
import { HintsService } from 'src/hints/hints.service';
import { Puzzles } from 'src/puzzles/puzzles.entity';
import { Hints } from '../hints/hints.entity';

@Injectable()
export class UserProgressService {
  constructor(
    @InjectRepository(UserProgress)
    private readonly userProgressRepository: Repository<UserProgress>,

    private readonly levelProgressService: LevelProgressService,
    private readonly usersService: UsersService,
    private readonly puzzlesService: PuzzlesService,
    private readonly hintsService: HintsService,
  ) {}

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return this.userProgressRepository.find({
      where: { user: { id: userId } },
      relations: ['puzzles', 'hints'],
    });
  }

  async updateProgress(userId: number, puzzleId: number, hintId: number | null, completed: boolean): Promise<UserProgress> {
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
      relations: ['puzzles'],
    });

    return progress.reduce((total, p) => total + p.puzzles.pointValue, 0);
  }

  async getSolvedPuzzlesInLevel(userId: number, levelId: string): Promise<{ puzzles: Puzzles[]; count: number }> {
    return this.levelProgressService.getPuzzlesSolvedPerLevel(userId, levelId);
  }

  async getLevelProgress(userId: number, levelId: string): Promise<{ progress: number; solved: number; total: number }> {
    return this.levelProgressService.calculateLevelCompletion(userId, levelId);
  }
}
