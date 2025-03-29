import { Injectable, NotFoundException, ConflictException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { type Repository, type FindOptionsWhere, Between } from "typeorm"
import type { ConfigService } from "@nestjs/config"
import { v4 as uuidv4 } from "uuid"
import { Referral } from "./entities/referral.entity"
import { ReferralEarning } from "./entities/referral-earning.entity"
import type { CreateReferralDto } from "./dto/create-referral.dto"
import type { ReferralEarningsQueryDto, ReferralEarningsResponseDto } from "./dto/referral-earnings.dto"
import type { ReferralTreeQueryDto, ReferralTreeResponseDto, ReferralTreeNodeDto } from "./dto/referral-tree.dto"
import { REFERRAL_TIERS, DEFAULT_REFERRAL_PERCENTAGES } from "./referral.constants"

@Injectable()
export class ReferralService {
  private readonly referralPercentages: Record<number, number>;

  constructor(
    @InjectRepository(Referral)
    private referralRepository: Repository<Referral>,
    @InjectRepository(ReferralEarning)
    private referralEarningRepository: Repository<ReferralEarning>,
    private configService: ConfigService,
  ) {
    // Load referral percentages from environment variables or use defaults
    this.referralPercentages = {
      [REFERRAL_TIERS.TIER_1]: this.getPercentageFromEnv('REFERRAL_TIER_1_PERCENTAGE', DEFAULT_REFERRAL_PERCENTAGES[REFERRAL_TIERS.TIER_1]),
      [REFERRAL_TIERS.TIER_2]: this.getPercentageFromEnv('REFERRAL_TIER_2_PERCENTAGE', DEFAULT_REFERRAL_PERCENTAGES[REFERRAL_TIERS.TIER_2]),
      [REFERRAL_TIERS.TIER_3]: this.getPercentageFromEnv('REFERRAL_TIER_3_PERCENTAGE', DEFAULT_REFERRAL_PERCENTAGES[REFERRAL_TIERS.TIER_3]),
    };
  }

  private getPercentageFromEnv(key: string, defaultValue: number): number {
    const value = this.configService.get<string>(key)
    return value ? Number.parseFloat(value) : defaultValue
  }

  private generateReferralCode(): string {
    // Generate a unique referral code (8 characters)
    return uuidv4().substring(0, 8).toUpperCase()
  }

  async createReferral(createReferralDto: CreateReferralDto): Promise<Referral> {
    const { referrerId, refereeId, code } = createReferralDto

    // Check if referee already has a referral
    const existingReferee = await this.referralRepository.findOne({
      where: { refereeId },
    })

    if (existingReferee) {
      throw new ConflictException("User is already referred by someone else")
    }

    // Check if referrer exists (optional, depends on your business logic)
    // This is where you might want to check against your User entity
    // For now, we'll just proceed without this check

    // Generate a unique referral code if not provided
    const referralCode = code || this.generateReferralCode()

    // Check if code is unique
    if (code) {
      const existingCode = await this.referralRepository.findOne({
        where: { code: referralCode },
      })

      if (existingCode) {
        throw new ConflictException("Referral code already exists")
      }
    }

    // Find parent referral (if any) to establish the tier
    const parentReferral = await this.referralRepository.findOne({
      where: { refereeId: referrerId },
      relations: ["parentReferral"],
    })

    const newReferral = this.referralRepository.create({
      referrerId,
      refereeId,
      code: referralCode,
      tier: 1, // Default tier
      parentReferralId: parentReferral?.id,
    })

    // If there's a parent referral, set the tier accordingly
    if (parentReferral) {
      newReferral.tier = parentReferral.tier + 1
    }

    return this.referralRepository.save(newReferral)
  }

  async getReferralByCode(code: string): Promise<Referral> {
    const referral = await this.referralRepository.findOne({
      where: { code },
    })

    if (!referral) {
      throw new NotFoundException(`Referral with code ${code} not found`)
    }

    return referral
  }

  async activateReferral(code: string, refereeId: string): Promise<Referral> {
    const referral = await this.getReferralByCode(code)

    if (referral.activated) {
      throw new ConflictException("Referral has already been activated")
    }

    referral.refereeId = refereeId
    referral.activated = true
    return this.referralRepository.save(referral)
  }

  async recordReferralEarning(
    referralId: string,
    userId: string,
    amount: number,
    description?: string,
    transactionId?: string,
  ): Promise<ReferralEarning[]> {
    // Find the referral
    const referral = await this.referralRepository.findOne({
      where: { id: referralId },
      relations: ["parentReferral", "parentReferral.parentReferral"],
    })

    if (!referral) {
      throw new NotFoundException(`Referral with ID ${referralId} not found`)
    }

    const earnings: ReferralEarning[] = []

    // Record earnings for direct referrer (Tier 1)
    if (referral.referrerId) {
      const tier1Earning = this.referralEarningRepository.create({
        referralId,
        userId: referral.referrerId,
        amount: amount * (this.referralPercentages[REFERRAL_TIERS.TIER_1] / 100),
        tier: REFERRAL_TIERS.TIER_1,
        percentage: this.referralPercentages[REFERRAL_TIERS.TIER_1],
        description,
        transactionId,
      })
      earnings.push(await this.referralEarningRepository.save(tier1Earning))
    }

    // Record earnings for Tier 2 referrer (if exists)
    if (referral.parentReferral && referral.parentReferral.referrerId) {
      const tier2Earning = this.referralEarningRepository.create({
        referralId: referral.parentReferral.id,
        userId: referral.parentReferral.referrerId,
        amount: amount * (this.referralPercentages[REFERRAL_TIERS.TIER_2] / 100),
        tier: REFERRAL_TIERS.TIER_2,
        percentage: this.referralPercentages[REFERRAL_TIERS.TIER_2],
        description,
        transactionId,
      })
      earnings.push(await this.referralEarningRepository.save(tier2Earning))
    }

    // Record earnings for Tier 3 referrer (if exists)
    if (
      referral.parentReferral &&
      referral.parentReferral.parentReferral &&
      referral.parentReferral.parentReferral.referrerId
    ) {
      const tier3Earning = this.referralEarningRepository.create({
        referralId: referral.parentReferral.parentReferral.id,
        userId: referral.parentReferral.parentReferral.referrerId,
        amount: amount * (this.referralPercentages[REFERRAL_TIERS.TIER_3] / 100),
        tier: REFERRAL_TIERS.TIER_3,
        percentage: this.referralPercentages[REFERRAL_TIERS.TIER_3],
        description,
        transactionId,
      })
      earnings.push(await this.referralEarningRepository.save(tier3Earning))
    }

    return earnings
  }

  async getReferralEarnings(query: ReferralEarningsQueryDto): Promise<ReferralEarningsResponseDto> {
    const { userId, startDate, endDate } = query

    if (!userId) {
      throw new BadRequestException("User ID is required")
    }

    // Build where conditions
    const whereConditions: FindOptionsWhere<ReferralEarning> = { userId }

    if (startDate && endDate) {
      whereConditions.createdAt = Between(new Date(startDate), new Date(endDate))
    }

    // Get all earnings for the user
    const earnings = await this.referralEarningRepository.find({
      where: whereConditions,
    })

    // Calculate totals
    const totalEarnings = earnings.reduce((sum, earning) => sum + Number(earning.amount), 0)
    const tier1Earnings = earnings
      .filter((e) => e.tier === REFERRAL_TIERS.TIER_1)
      .reduce((sum, earning) => sum + Number(earning.amount), 0)
    const tier2Earnings = earnings
      .filter((e) => e.tier === REFERRAL_TIERS.TIER_2)
      .reduce((sum, earning) => sum + Number(earning.amount), 0)
    const tier3Earnings = earnings
      .filter((e) => e.tier === REFERRAL_TIERS.TIER_3)
      .reduce((sum, earning) => sum + Number(earning.amount), 0)

    // Count referrals by tier
    const tier1Count = await this.referralRepository.count({
      where: { referrerId: userId, tier: REFERRAL_TIERS.TIER_1 },
    })
    const tier2Count = await this.referralRepository.count({
      where: { referrerId: userId, tier: REFERRAL_TIERS.TIER_2 },
    })
    const tier3Count = await this.referralRepository.count({
      where: { referrerId: userId, tier: REFERRAL_TIERS.TIER_3 },
    })

    return {
      userId,
      totalEarnings,
      tier1Earnings,
      tier2Earnings,
      tier3Earnings,
      referrals: [
        { tier: REFERRAL_TIERS.TIER_1, count: tier1Count },
        { tier: REFERRAL_TIERS.TIER_2, count: tier2Count },
        { tier: REFERRAL_TIERS.TIER_3, count: tier3Count },
      ],
    }
  }

  async getReferralTree(query: ReferralTreeQueryDto): Promise<ReferralTreeResponseDto> {
    const { userId, maxDepth = 3 } = query

    // Get all referrals where the user is the referrer
    const referrals = await this.referralRepository.find({
      where: { referrerId: userId },
    })

    if (referrals.length === 0) {
      return {
        userId,
        totalReferrals: 0,
        tree: null,
      }
    }

    // Build the tree recursively
    const buildTree = async (referrerId: string, currentDepth: number): Promise<ReferralTreeNodeDto> => {
      if (currentDepth > maxDepth) {
        return null
      }

      const referrals = await this.referralRepository.find({
        where: { referrerId },
      })

      if (referrals.length === 0) {
        return null
      }

      // Create a node for the current referrer
      const node: ReferralTreeNodeDto = {
        id: referrals[0].id, // Using the first referral's ID as the node ID
        userId: referrerId,
        tier: referrals[0].tier,
        createdAt: referrals[0].createdAt,
        children: [],
      }

      // Recursively build children
      for (const referral of referrals) {
        const childNode = await buildTree(referral.refereeId, currentDepth + 1)
        if (childNode) {
          node.children.push(childNode)
        }
      }

      return node
    }

    const tree = await buildTree(userId, 1)
    const totalReferrals = this.countTotalReferrals(tree)

    return {
      userId,
      totalReferrals,
      tree,
    }
  }

  private countTotalReferrals(node: ReferralTreeNodeDto): number {
    if (!node) {
      return 0
    }

    let count = 1 // Count the current node
    if (node.children) {
      for (const child of node.children) {
        count += this.countTotalReferrals(child)
      }
    }
    return count
  }

  async getUserReferrals(userId: string): Promise<Referral[]> {
    return this.referralRepository.find({
      where: { referrerId: userId },
      order: { createdAt: "DESC" },
    })
  }
}

