import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './providers/leaderboard.service';
import { ScoresService } from 'src/scores/scores.service';

@Module({
  controllers: [LeaderboardController],
  providers: [LeaderboardService, ScoresService], //provide intra-module dependency
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
