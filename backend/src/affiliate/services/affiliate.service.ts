import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Affiliate } from "../entities/affiliate.entity"
import { Referral, ReferralStatus } from "../entities/referral.entity"
import { Payout, PayoutStatus } from "../entities/payout.entity"
import type { RegisterAffiliateDto } from "../dtos/register-affiliate.dto"
import type { RequestPayoutDto } from "../dtos/request-payout.dto"
import { v4 as uuidv4 } from "uuid"

@Injectable()
export class AffiliateService {
  constructor(
    @InjectRepository(Affiliate)
    private affiliateRepository: Repository<Affiliate>,
    @InjectRepository(Referral)
    private referralRepository: Repository<Referral>,
    @InjectRepository(Payout)
    private payoutRepository: Repository<Payout>,
  ) {}

  async registerAffiliate(registerAffiliateDto: RegisterAffiliateDto): Promise<Affiliate> {
    const { userId } = registerAffiliateDto

    // Check if user is already an affiliate
    const existingAffiliate = await this.affiliateRepository.findOne({
      where: { userId },
    })

    if (existingAffiliate) {
      throw new BadRequestException("User is already registered as an affiliate")
    }

    // Generate unique referral code
    const referralCode = this.generateReferralCode()

    // Create new affiliate
    const affiliate = this.affiliateRepository.create({
      userId,
      referralCode,
    })

    return this.affiliateRepository.save(affiliate)
  }

  async trackReferral(referralCode: string, referredUserId: string): Promise<Referral> {
    // Find affiliate by referral code
    const affiliate = await this.affiliateRepository.findOne({
      where: { referralCode, isActive: true },
    })

    if (!affiliate) {
      throw new NotFoundException("Invalid or inactive referral code")
    }

    // Check if this user has already been referred
    const existingReferral = await this.referralRepository.findOne({
      where: { referredUserId },
    })

    if (existingReferral) {
      throw new BadRequestException("User has already been referred")
    }

    // Create new referral
    const referral = this.referralRepository.create({
      referredUserId,
      affiliate,
      status: ReferralStatus.PENDING,
    })

    return this.referralRepository.save(referral)
  }

  async convertReferral(referralId: string, conversionAmount: number): Promise<Referral> {
    const referral = await this.referralRepository.findOne({
      where: { id: referralId },
      relations: ["affiliate"],
    })

    if (!referral) {
      throw new NotFoundException("Referral not found")
    }

    if (referral.status !== ReferralStatus.PENDING) {
      throw new BadRequestException("Referral has already been processed")
    }

    // Calculate commission (e.g., 10% of conversion amount)
    const commissionRate = 0.1 // This could be configurable
    const commissionAmount = conversionAmount * commissionRate

    // Update referral
    referral.status = ReferralStatus.CONVERTED
    referral.conversionAmount = conversionAmount
    await this.referralRepository.save(referral)

    // Update affiliate balance
    const affiliate = referral.affiliate
    affiliate.totalEarnings += commissionAmount
    affiliate.availableBalance += commissionAmount
    await this.affiliateRepository.save(affiliate)

    return referral
  }

  async getAffiliateByUserId(userId: string): Promise<Affiliate> {
    const affiliate = await this.affiliateRepository.findOne({
      where: { userId },
    })

    if (!affiliate) {
      throw new NotFoundException("Affiliate not found")
    }

    return affiliate
  }

  async getReferrals(affiliateId: string): Promise<Referral[]> {
    return this.referralRepository.find({
      where: { affiliateId },
      order: { createdAt: "DESC" },
    })
  }

  async getPayouts(affiliateId: string): Promise<Payout[]> {
    return this.payoutRepository.find({
      where: { affiliateId },
      order: { createdAt: "DESC" },
    })
  }

  async requestPayout(affiliateId: string, requestPayoutDto: RequestPayoutDto): Promise<Payout> {
    const { amount, paymentMethod } = requestPayoutDto

    const affiliate = await this.affiliateRepository.findOne({
      where: { id: affiliateId },
    })

    if (!affiliate) {
      throw new NotFoundException("Affiliate not found")
    }

    if (affiliate.availableBalance < amount) {
      throw new BadRequestException("Insufficient balance")
    }

    // Create payout request
    const payout = this.payoutRepository.create({
      amount,
      paymentMethod,
      status: PayoutStatus.PENDING,
      affiliate,
    })

    // Reduce available balance
    affiliate.availableBalance -= amount
    await this.affiliateRepository.save(affiliate)

    return this.payoutRepository.save(payout)
  }

  async processPayout(payoutId: string, status: PayoutStatus, paymentReference?: string): Promise<Payout> {
    const payout = await this.payoutRepository.findOne({
      where: { id: payoutId },
      relations: ["affiliate"],
    })

    if (!payout) {
      throw new NotFoundException("Payout not found")
    }

    if (payout.status !== PayoutStatus.PENDING) {
      throw new BadRequestException("Payout has already been processed")
    }

    // If payout failed, return amount to affiliate's available balance
    if (status === PayoutStatus.FAILED) {
      const affiliate = payout.affiliate
      affiliate.availableBalance += payout.amount
      await this.affiliateRepository.save(affiliate)
    }

    // Update payout status
    payout.status = status
    if (paymentReference) {
      payout.paymentReference = paymentReference
    }

    return this.payoutRepository.save(payout)
  }

  private generateReferralCode(): string {
    // Generate a unique referral code (could be improved with custom logic)
    return uuidv4().substring(0, 8).toUpperCase()
  }
}

