import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TimeTrial } from '../time-trial.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TimetrialService {
    constructor(
    @InjectRepository(TimeTrial)
    private trialRepo: Repository<TimeTrial>,
  ) {}

  async startTrial(userId: string, puzzleId: string): Promise<TimeTrial> {
    const trial = this.trialRepo.create({
      userId,
      puzzleId,
      startTime: new Date(),
    });
    return await this.trialRepo.save(trial);
  }

  async submitTrial(id: string): Promise<TimeTrial> {
    const trial = await this.trialRepo.findOne({ where: { id } });
    if (!trial) throw new NotFoundException('Trial not found');

    const endTime = new Date();
    const timeLimitInMinutes = 5; // configurable
    const diff = (endTime.getTime() - new Date(trial.startTime).getTime()) / 60000;

    if (diff > timeLimitInMinutes) {
      throw new BadRequestException('Time limit exceeded');
    }

    trial.endTime = endTime;
    trial.completed = true;
    return await this.trialRepo.save(trial);
  }

  async getResults(userId: string): Promise<TimeTrial[]> {
    return await this.trialRepo.find({
      where: { userId },
      relations: ['puzzle'],
      order: { endTime: 'DESC' },
    });
  }

  // Optional: basic leaderboard logic
  async getLeaderboard(puzzleId: string): Promise<TimeTrial[]> {
    return await this.trialRepo.find({
      where: { puzzleId, completed: true },
      order: { endTime: 'ASC' },
      take: 10,
    });
  }
}
