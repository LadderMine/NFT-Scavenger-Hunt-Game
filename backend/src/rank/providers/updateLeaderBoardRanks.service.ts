import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leaderboard } from 'src/leaderboard/entities/leaderboard.entity';
import { CalculateRanks } from './CalculateRanks.service';

@Injectable()
export class UpdateLeaderboardRanks {
  constructor(
    private readonly calculateRanks: CalculateRanks,

    @InjectRepository(Leaderboard)
    private readonly leaderboardRepository: Repository<Leaderboard>,
  ) {}

  public async updateLeaderboardRanks() {
    const rankedPlayers = await this.calculateRanks.calculateRanks(); // Fetch calculated ranks

    for (const { userId, rank } of rankedPlayers) {
      await this.leaderboardRepository.update(
        { user: { id: userId } },
        { rank },
      ); // Update leaderboard with new ranks
    }
  }
}
