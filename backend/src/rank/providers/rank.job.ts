import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RankService } from './rank.service';

@Injectable()
export class RankJob {
  constructor(private readonly rankService: RankService) {}

  @Cron('*/1 * * * *') // Runs every 1 minute
  async handleCron() {
    console.log('Updating leaderboard rankings...');
    await this.rankService.updateLeaderboardRanks();
  }
}
