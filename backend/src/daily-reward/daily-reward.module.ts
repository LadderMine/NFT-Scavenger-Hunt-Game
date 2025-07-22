import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyRewardLog } from './entities/daily-reward-log.entity';
import { DailyRewardService } from './daily-reward.service';
import { DailyRewardController } from './daily-reward.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DailyRewardLog])],
  providers: [DailyRewardService],
  controllers: [DailyRewardController],
})
export class DailyRewardModule {}