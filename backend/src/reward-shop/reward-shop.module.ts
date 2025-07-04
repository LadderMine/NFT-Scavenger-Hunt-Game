import { Module } from '@nestjs/common';
import { RewardShopService } from './reward-shop.service';
import { RewardShopController } from './reward-shop.controller';

@Module({
  providers: [RewardShopService],
  controllers: [RewardShopController],
  exports: [RewardShopService],
})
export class RewardShopModule {}
