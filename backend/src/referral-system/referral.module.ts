import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ReferralController } from "./referral.controller"
import { ReferralService } from "./referral.service"
import { ReferralCode } from "./entities/referral-code.entity"
import { Referral } from "./entities/referral.entity"
import { ReferralRewardService } from "./referral-reward.service"

@Module({
  imports: [TypeOrmModule.forFeature([ReferralCode, Referral])],
  controllers: [ReferralController],
  providers: [ReferralService, ReferralRewardService],
  exports: [ReferralService, ReferralRewardService],
})
export class ReferralModule {}

