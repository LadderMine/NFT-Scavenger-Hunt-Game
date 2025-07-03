import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import { type ReferralBonus, BonusType, BonusStatus } from "../entities/referral-bonus.entity"
import type { ReferralInvite } from "../entities/referral-invite.entity"
import type { ReferralCodeService } from "./referral-code.service"

export interface BonusConfig {
  referralReward: number
  signupBonus: number
  actionBonus: number
  currency: string
}

@Injectable()
export class ReferralBonusService {
  private readonly defaultConfig: BonusConfig = {
    referralReward: 10.0,
    signupBonus: 5.0,
    actionBonus: 2.5,
    currency: "USD",
  }

  constructor(
    private readonly bonusRepository: Repository<ReferralBonus>,
    private readonly referralCodeService: ReferralCodeService,
  ) {}

  async allocateReferralBonus(invite: ReferralInvite, config: Partial<BonusConfig> = {}): Promise<ReferralBonus[]> {
    const bonusConfig = { ...this.defaultConfig, ...config }
    const bonuses: ReferralBonus[] = []

    // Referral reward for the referrer
    const referralBonus = this.bonusRepository.create({
      userId: invite.referralCode.user.id,
      referralInviteId: invite.id,
      type: BonusType.REFERRAL_REWARD,
      amount: bonusConfig.referralReward,
      currency: bonusConfig.currency,
      description: `Referral bonus for inviting ${invite.email}`,
    })

    bonuses.push(await this.bonusRepository.save(referralBonus))

    // Signup bonus for the new user (if they registered)
    if (invite.invitedUserId) {
      const signupBonus = this.bonusRepository.create({
        userId: invite.invitedUserId,
        referralInviteId: invite.id,
        type: BonusType.SIGNUP_BONUS,
        amount: bonusConfig.signupBonus,
        currency: bonusConfig.currency,
        description: `Welcome bonus for signing up via referral`,
      })

      bonuses.push(await this.bonusRepository.save(signupBonus))
    }

    // Update referral code total bonus
    const totalBonusAmount = bonuses.reduce((sum, bonus) => sum + Number(bonus.amount), 0)
    await this.referralCodeService.updateStats(invite.referralCodeId, {
      bonus: totalBonusAmount,
    })

    return bonuses
  }

  async allocateActionBonus(
    userId: string,
    referralInviteId: string,
    description: string,
    config: Partial<BonusConfig> = {},
  ): Promise<ReferralBonus> {
    const bonusConfig = { ...this.defaultConfig, ...config }

    const bonus = this.bonusRepository.create({
      userId,
      referralInviteId,
      type: BonusType.ACTION_BONUS,
      amount: bonusConfig.actionBonus,
      currency: bonusConfig.currency,
      description,
    })

    return this.bonusRepository.save(bonus)
  }

  async processBonus(bonusId: string): Promise<ReferralBonus> {
    const bonus = await this.bonusRepository.findOne({
      where: { id: bonusId },
    })

    if (!bonus) {
      throw new NotFoundException("Bonus not found")
    }

    // Here you would integrate with your payment/wallet system
    // For now, we'll just mark it as processed
    bonus.status = BonusStatus.PROCESSED
    bonus.processedAt = new Date()

    return this.bonusRepository.save(bonus)
  }

  async findByUserId(userId: string): Promise<ReferralBonus[]> {
    return this.bonusRepository.find({
      where: { userId },
      relations: ["referralInvite"],
      order: { createdAt: "DESC" },
    })
  }

  async findPendingBonuses(): Promise<ReferralBonus[]> {
    return this.bonusRepository.find({
      where: { status: BonusStatus.PENDING },
      relations: ["user", "referralInvite"],
      order: { createdAt: "ASC" },
    })
  }

  async getBonusStats(userId: string): Promise<{
    totalEarned: number
    totalPending: number
    totalProcessed: number
    bonusesByType: Record<BonusType, number>
  }> {
    const bonuses = await this.findByUserId(userId)

    const stats = {
      totalEarned: 0,
      totalPending: 0,
      totalProcessed: 0,
      bonusesByType: {
        [BonusType.REFERRAL_REWARD]: 0,
        [BonusType.SIGNUP_BONUS]: 0,
        [BonusType.ACTION_BONUS]: 0,
      },
    }

    bonuses.forEach((bonus) => {
      const amount = Number(bonus.amount)
      stats.totalEarned += amount
      stats.bonusesByType[bonus.type] += amount

      if (bonus.status === BonusStatus.PENDING) {
        stats.totalPending += amount
      } else if (bonus.status === BonusStatus.PROCESSED) {
        stats.totalProcessed += amount
      }
    })

    return stats
  }
}
