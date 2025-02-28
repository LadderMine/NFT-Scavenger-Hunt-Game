import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './providers/leaderboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leaderboard } from './entities/leaderboard.entity';
import { LeaderboardRepository } from './leaderboard.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Leaderboard]),
  ],
  controllers: [LeaderboardController],
  providers: [LeaderboardRepository, LeaderboardService],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
