import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './providers/leaderboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoresModule } from 'src/scores/scores.module';

@Module({
  imports: [TypeOrmModule.forFeature([ScoresModule])],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './providers/leaderboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoresModule } from 'src/scores/scores.module';

@Module({
  imports: [TypeOrmModule.forFeature([ScoresModule])],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
