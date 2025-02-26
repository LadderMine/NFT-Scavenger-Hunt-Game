import { Module } from '@nestjs/common';
import { RankService } from './rank.service';
import { RankController } from './rank.controller';
import { CalculateRanks } from './providers/CalculateRanks.service';
import { UpdateLeaderboardRanks } from './providers/updateLeaderBoardRanks.service';

@Module({
  controllers: [RankController],
  providers: [RankService, CalculateRanks, UpdateLeaderboardRanks],
})
export class RankModule {}
