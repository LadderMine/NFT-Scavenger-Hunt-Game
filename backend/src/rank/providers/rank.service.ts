import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leaderboard } from './leaderboard.entity';

@Injectable()
export class RankService {
  constructor(
    @InjectRepository(Leaderboard)
    private leaderboardRepository: Repository<Leaderboard>,
  ) {}

  // Function to update player's score and refresh rankings in real-time
  async updatePlayerScore(userId: number, newPoints: number): Promise<void> {
    await this.leaderboardRepository.update({ userId }, { total_points: newPoints });
    await this.updateLeaderboardRanks(); // Trigger leaderboard ranking update
  }

  // Function to recalculate ranks for all players
  async updateLeaderboardRanks(): Promise<void> {
    const leaderboardEntries = await this.leaderboardRepository.find({
      order: { total_points: 'DESC' },
    });

    for (let i = 0; i < leaderboardEntries.length; i++) {
      leaderboardEntries[i].rank = i + 1; // Assign new ranks based on total_points
    }

    await this.leaderboardRepository.save(leaderboardEntries);
  }
}
