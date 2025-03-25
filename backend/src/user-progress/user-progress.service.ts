import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import type { Hints } from '../hints/hints.entity';
import { UserProgress } from './userprogress.entity';
import { Repository } from 'typeorm';
import { Hints } from '../hints/hints.entity';
import { UserProgress } from './userprogress.entity';
import { UserProgressDto } from './dto/user-progress.dto';

@Injectable()
export class UserProgressService {
  constructor(
    @InjectRepository(UserProgress)
    private userProgressRepository: Repository<UserProgress>,
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

  async getUserScore(userId: number, puzzleId: number): Promise<number> {
    const score = await this.userProgressRepository
      .createQueryBuilder('progress')
      .innerJoinAndSelect('progress.puzzle', 'puzzle')
      .innerJoinAndSelect('progress.score', 'score')
      .where('progress.userId = :userId', { userId })
      .andWhere('progress.puzzleId = :puzzleId', { puzzleId })
      .andWhere('progress.completed = :completed', { completed: true })
      .select('score.value', 'scoreValue')
      .getRawOne();

    if (!score) {
      throw new NotFoundException('Score not found for this puzzle.');
    }

    return score.scoreValue;
  }
}
