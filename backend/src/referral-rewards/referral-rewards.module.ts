import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { EventEmitterModule } from "@nestjs/event-emitter"
import { ConfigModule } from "@nestjs/config"

import { Referral } from "./entities/referral.entity"
import { Reward } from "./entities/reward.entity"
import { ReferralsService } from "./services/referrals.service"
import { RewardsService } from "./services/rewards.service"
import { ReferralsController } from "./controllers/referrals.controller"
import { RewardsController } from "./controllers/rewards.controller"
import { ReferralListener } from "./listeners/referral.listener"

@Module({
  imports: [TypeOrmModule.forFeature([Referral, Reward]), EventEmitterModule.forRoot(), ConfigModule],
  controllers: [ReferralsController, RewardsController],
  providers: [ReferralsService, RewardsService, ReferralListener],
  exports: [ReferralsService, RewardsService],
})
export class ReferralRewardsModule {}

