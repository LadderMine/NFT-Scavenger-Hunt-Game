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
    // Fetch recalculated ranks for all players
    const rankedPlayers = await this.calculateRanks.calculateRanks();

    for (const { userId, rank } of rankedPlayers) {
      // Fetch the current leaderboard entry for this user
      const leaderboardEntry = await this.leaderboardRepository.findOne({ where: { user: { id: userId } } });

      // Only update if the leaderboard rank has changed
      if (!leaderboardEntry || leaderboardEntry.rank !== rank) {
        await this.leaderboardRepository.update(
          { user: { id: userId } },
          { rank },
        );
      }
    }
  }
}
