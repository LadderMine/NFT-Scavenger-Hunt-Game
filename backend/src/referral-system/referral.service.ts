import { Injectable, NotFoundException, BadRequestException, ConflictException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { ReferralCode } from "./entities/referral-code.entity"
import { Referral, ReferralStatus } from "./entities/referral.entity"
import type { CreateReferralCodeDto } from "./dto/create-referral-code.dto"
import type { ApplyReferralDto } from "./dto/apply-referral.dto"
import type { UpdateReferralStatusDto } from "./dto/update-referral-status.dto"
import { v4 as uuidv4 } from "uuid"
import type { ReferralRewardService } from "./referral-reward.service"

@Injectable()
export class ReferralService {
  constructor(
    @InjectRepository(ReferralCode)
    private referralCodeRepository: Repository<ReferralCode>,
    @InjectRepository(Referral)
    private referralRepository: Repository<Referral>,
    private referralRewardService: ReferralRewardService,
  ) {}

  /**
   * Generate a unique referral code
   */
  private generateUniqueCode(): string {
    // Generate a code based on UUID and make it shorter and more user-friendly
    return uuidv4().substring(0, 8).toUpperCase()
  }

  /**
   * Create a new referral code for a user
   */
  async createReferralCode(createReferralCodeDto: CreateReferralCodeDto): Promise<ReferralCode> {
    // Check if user already has an active referral code
    const existingCode = await this.referralCodeRepository.findOne({
      where: {
        userId: createReferralCodeDto.userId,
        active: true,
      },
    })

    if (existingCode) {
      return existingCode
    }

    // Generate a unique code
    let code = this.generateUniqueCode()
    let codeExists = await this.referralCodeRepository.findOne({ where: { code } })

    // Ensure code uniqueness
    while (codeExists) {
      code = this.generateUniqueCode()
      codeExists = await this.referralCodeRepository.findOne({ where: { code } })
    }

    // Create and save the new referral code
    const referralCode = this.referralCodeRepository.create({
      code,
      userId: createReferralCodeDto.userId,
      expiresAt: createReferralCodeDto.expiresAt,
    })

    return this.referralCodeRepository.save(referralCode)
  }

  /**
   * Get a referral code by its code string
   */
  async getReferralCodeByCode(code: string): Promise<ReferralCode> {
    const referralCode = await this.referralCodeRepository.findOne({
      where: { code, active: true },
    })

    if (!referralCode) {
      throw new NotFoundException(`Referral code ${code} not found or inactive`)
    }

    // Check if code is expired
    if (referralCode.expiresAt && new Date() > referralCode.expiresAt) {
      referralCode.active = false
      await this.referralCodeRepository.save(referralCode)
      throw new BadRequestException("Referral code has expired")
    }

    return referralCode
  }

  /**
   * Get all referral codes for a user
   */
  async getUserReferralCodes(userId: string): Promise<ReferralCode[]> {
    return this.referralCodeRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    })
  }

  /**
   * Apply a referral code
   */
  async applyReferralCode(applyReferralDto: ApplyReferralDto): Promise<Referral> {
    const { code, referredId } = applyReferralDto

    // Get the referral code
    const referralCode = await this.getReferralCodeByCode(code)

    // Prevent self-referral
    if (referralCode.userId === referredId) {
      throw new BadRequestException("You cannot refer yourself")
    }

    // Check if user has already been referred
    const existingReferral = await this.referralRepository.findOne({
      where: { referredId },
    })

    if (existingReferral) {
      throw new ConflictException("User has already been referred")
    }

    // Create the referral
    const referral = this.referralRepository.create({
      referrerId: referralCode.userId,
      referredId,
      referralCodeId: referralCode.id,
      status: ReferralStatus.PENDING,
    })

    return this.referralRepository.save(referral)
  }

  /**
   * Update referral status
   */
  async updateReferralStatus(updateReferralStatusDto: UpdateReferralStatusDto): Promise<Referral> {
    const { referralId, status } = updateReferralStatusDto

    const referral = await this.referralRepository.findOne({
      where: { id: referralId },
      relations: ["referralCode"],
    })

    if (!referral) {
      throw new NotFoundException(`Referral with ID ${referralId} not found`)
    }

    // Update status and relevant timestamps
    referral.status = status

    if (status === ReferralStatus.COMPLETED && !referral.completedAt) {
      referral.completedAt = new Date()
    }

    if (status === ReferralStatus.REWARDED && !referral.rewardedAt) {
      referral.rewardedAt = new Date()

      // Process rewards when status changes to REWARDED
      await this.referralRewardService.processReferralReward(referral)
    }

    return this.referralRepository.save(referral)
  }

  /**
   * Get all referrals made by a user
   */
  async getUserReferrals(userId: string): Promise<Referral[]> {
    return this.referralRepository.find({
      where: { referrerId: userId },
      relations: ["referralCode"],
      order: { createdAt: "DESC" },
    })
  }

  /**
   * Get referral statistics for a user
   */
  async getUserReferralStats(userId: string): Promise<any> {
    const totalReferrals = await this.referralRepository.count({
      where: { referrerId: userId },
    })

    const completedReferrals = await this.referralRepository.count({
      where: {
        referrerId: userId,
        status: ReferralStatus.COMPLETED,
      },
    })

    const rewardedReferrals = await this.referralRepository.count({
      where: {
        referrerId: userId,
        status: ReferralStatus.REWARDED,
      },
    })

    return {
      totalReferrals,
      completedReferrals,
      rewardedReferrals,
    }
  }
}

