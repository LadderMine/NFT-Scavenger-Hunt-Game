import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from './progress.entity';
import { ProgressResponseDto } from './dto/progress-response.dto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private readonly progressRepo: Repository<Progress>,
  ) {}

  async getProgressByUserId(userId: string): Promise<ProgressResponseDto> {
    const progress = await this.progressRepo.findOne({ where: { userId } });

    if (!progress) {
      throw new NotFoundException(`Progress not found for user with ID ${userId}`);
    }

    // Optionally recalculate percentComplete if needed
    const percentComplete =
      progress.totalPuzzles > 0
        ? (progress.completedPuzzles / progress.totalPuzzles) * 100
        : 0;

    progress.percentComplete = parseFloat(percentComplete.toFixed(2));

    await this.progressRepo.save(progress); // Persist recalculated value

    return {
      userId: progress.userId,
      completedPuzzles: progress.completedPuzzles,
      totalPuzzles: progress.totalPuzzles,
      percentComplete: progress.percentComplete,
      lastUpdated: progress.lastUpdated,
    };
  }
}
