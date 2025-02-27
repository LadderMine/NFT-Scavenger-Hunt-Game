import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leaderboard } from './entities/leaderboard.entity';
import { UpdateLeaderboardRanks } from 'src/rank/providers/updateLeaderBoardRanks.service';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Leaderboard)
    private readonly leaderboardRepository: Repository<Leaderboard>,

    private readonly updateLeaderboardRanks: UpdateLeaderboardRanks, // Inject rank service
  ) {}

  public async updatePlayerScore(userId: number, newScore: number) {
    // Update player's score in leaderboard
    await this.leaderboardRepository.update(
      { user: { id: userId } },
      { total_points: newScore },
    );

    // Call rank recalculation
    await this.updateLeaderboardRanks.updateLeaderboardRanks();
  }
}
