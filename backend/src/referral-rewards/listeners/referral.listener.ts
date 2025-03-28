import { Injectable } from "@nestjs/common"
import { OnEvent } from "@nestjs/event-emitter"
import type { ConfigService } from "@nestjs/config"
import type { Referral } from "../entities/referral.entity"
import type { RewardsService } from "../services/rewards.service"
import { RewardType } from "../entities/reward.entity"

@Injectable()
export class ReferralListener {
  constructor(
    private readonly rewardsService: RewardsService,
    private readonly configService: ConfigService,
  ) {}

  @OnEvent("referral.completed")
  async handleReferralCompletedEvent(referral: Referral) {
    // Get reward configuration from environment variables or config
    const rewardType = this.configService.get<RewardType>("REFERRAL_REWARD_TYPE", RewardType.BONUS)
    const rewardValue = this.configService.get<number>("REFERRAL_REWARD_VALUE", 100)

    // Create a reward for the referrer
    await this.rewardsService.create({
      userId: referral.referrerId,
      type: rewardType,
      value: rewardValue,
    })

    // Optionally, you could also create a reward for the referred user
    const referredRewardValue = this.configService.get<number>("REFERRED_REWARD_VALUE", 50)
    if (referredRewardValue > 0) {
      await this.rewardsService.create({
        userId: referral.referredId,
        type: rewardType,
        value: referredRewardValue,
      })
    }
  }
}

