import { registerAs } from "@nestjs/config"
import { RewardType } from "../entities/reward.entity"

export default registerAs("referralRewards", () => ({
  rewardType: process.env.REFERRAL_REWARD_TYPE || RewardType.BONUS,
  rewardValue: Number.parseInt(process.env.REFERRAL_REWARD_VALUE || "100", 10),
  referredRewardValue: Number.parseInt(process.env.REFERRED_REWARD_VALUE || "50", 10),
  // Add other configuration options as needed
}))

