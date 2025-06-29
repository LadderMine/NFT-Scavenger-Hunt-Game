import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { Reward } from './entities/reward.entity';
import { RewardClaim } from './entities/reward-claim.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reward, RewardClaim]),
  ],
  controllers: [RewardsController],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {} 