import { Injectable } from "@nestjs/common"
import type { ReferralCodeService } from "./referral-code.service"
import type { ReferralInviteService } from "./referral-invite.service"
import type { ReferralBonusService } from "./referral-bonus.service"
import type { CreateReferralCodeDto } from "../dto/create-referral-code.dto"
import type { CreateInviteDto } from "../dto/create-invite.dto"
import type { ReferralStatsDto } from "../dto/referral-stats.dto"

@Injectable()
export class ReferralService {
  constructor(
    private readonly referralCodeService: ReferralCodeService,
    private readonly inviteService: ReferralInviteService,
    private readonly bonusService: ReferralBonusService,
  ) {}

  async createReferralCode(userId: string, createDto?: CreateReferralCodeDto) {
    return this.referralCodeService.createReferralCode(userId, createDto)
  }

  async sendInvite(createDto: CreateInviteDto) {
    const invite = await this.inviteService.createInvite(createDto)

    // Here you would integrate with your email service
    // await this.emailService.sendInviteEmail(invite.email, invite.referralCode.code);

    return invite
  }

  async handleUserRegistration(email: string, userId: string) {
    const invite = await this.inviteService.markAsRegistered(email, userId)

    if (invite) {
      // Automatically complete the invite and allocate bonuses
      const completedInvite = await this.inviteService.markAsCompleted(invite.id)
      await this.bonusService.allocateReferralBonus(completedInvite)

      return completedInvite
    }

    return null
  }

  async getUserReferralStats(userId: string): Promise<ReferralStatsDto> {
    const referralCodes = await this.referralCodeService.findByUserId(userId)
    const bonusStats = await this.bonusService.getBonusStats(userId)

    const totalInvites = referralCodes.reduce((sum, code) => sum + code.totalInvites, 0)
    const successfulInvites = referralCodes.reduce((sum, code) => sum + code.successfulInvites, 0)
    const totalBonusEarned = referralCodes.reduce((sum, code) => sum + Number(code.totalBonusEarned), 0)

    return {
      totalInvites,
      successfulInvites,
      conversionRate: totalInvites > 0 ? (successfulInvites / totalInvites) * 100 : 0,
      totalBonusEarned,
      pendingBonuses: bonusStats.totalPending,
      processedBonuses: bonusStats.totalProcessed,
    }
  }

  async getUserReferralCode(userId: string) {
    const codes = await this.referralCodeService.findByUserId(userId)
    return codes.find((code) => code.isActive) || null
  }

  async getReferralHistory(userId: string) {
    const referralCodes = await this.referralCodeService.findByUserId(userId)
    const invites = []

    for (const code of referralCodes) {
      const codeInvites = await this.inviteService.findByReferralCode(code.id)
      invites.push(...codeInvites)
    }

    return invites
  }

  async processCompletedInvite(inviteId: string) {
    const invite = await this.inviteService.markAsCompleted(inviteId)
    return this.bonusService.allocateReferralBonus(invite)
  }

  async cleanupExpiredInvites() {
    await this.inviteService.expireOldInvites()
  }
}
