import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { UpdateLeaderboardRanks } from 'src/rank/providers/updateLeaderBoardRanks.service';
import { Leaderboard } from './entities/leaderboard.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Leaderboard])],
  controllers: [LeaderboardController],
  providers: [LeaderboardService, UpdateLeaderboardRanks],
})
export class LeaderboardModule {}
