import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './providers/leaderboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leaderboard } from './entities/leaderboard.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Leaderboard]),
  ],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
