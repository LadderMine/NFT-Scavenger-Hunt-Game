import { Injectable, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { type Repository, MoreThan, Between, type FindOptionsWhere } from "typeorm"
import { FraudSuspect, FraudReviewStatus } from "./entities/fraud-suspect.entity"
import { FraudActivity, FraudActivityType } from "./entities/fraud-activity.entity"
import type { CreateFraudCheckDto } from "./dto/create-fraud-check.dto"
import type { UpdateFraudReviewDto } from "./dto/update-fraud-review.dto"
import type { FraudSuspectQueryDto } from "./dto/fraud-suspect-query.dto"
import type { FraudDetectionEventEmitter } from "./fraud-detection-event.emitter"

@Injectable()
export class FraudDetectionService {
  private readonly logger = new Logger(FraudDetectionService.name);

  constructor(
    @InjectRepository(FraudSuspect)
    private fraudSuspectRepository: Repository<FraudSuspect>,
    @InjectRepository(FraudActivity)
    private fraudActivityRepository: Repository<FraudActivity>,
    private eventEmitter: FraudDetectionEventEmitter,
  ) {}

  async checkForFraud(checkDto: CreateFraudCheckDto): Promise<boolean> {
    // Check for existing suspects with same IP or device fingerprint
    const existingSuspects = await this.fraudSuspectRepository.find({
      where: [{ ipAddress: checkDto.ipAddress }, { deviceFingerprint: checkDto.deviceFingerprint }],
    })

    // If we found existing suspects, this might be a duplicate account
    if (existingSuspects.length > 0) {
      const suspect = await this.createOrUpdateSuspect(checkDto, existingSuspects)
      await this.recordFraudActivity(
        suspect.id,
        FraudActivityType.DUPLICATE_ACCOUNT,
        {
          existingAccounts: existingSuspects.map((s) => s.userId),
          ipAddress: checkDto.ipAddress,
          deviceFingerprint: checkDto.deviceFingerprint,
        },
        70, // Higher severity score for duplicate accounts
      )
      return true
    }

    // Check for suspicious referral patterns if referral data is provided
    if (checkDto.referralData) {
      const isSuspiciousReferral = await this.checkSuspiciousReferral(
        checkDto.userId,
        checkDto.referralData.referrerId,
        checkDto.ipAddress,
      )

      if (isSuspiciousReferral) {
        const suspect = await this.createOrUpdateSuspect(checkDto, [])
        await this.recordFraudActivity(
          suspect.id,
          FraudActivityType.SUSPICIOUS_REFERRAL,
          {
            referrerId: checkDto.referralData.referrerId,
            referralCode: checkDto.referralData.referralCode,
            ipAddress: checkDto.ipAddress,
          },
          60, // Medium-high severity for suspicious referrals
        )
        return true
      }
    }

    // No fraud detected
    return false
  }

  private async createOrUpdateSuspect(
    checkDto: CreateFraudCheckDto,
    existingSuspects: FraudSuspect[],
  ): Promise<FraudSuspect> {
    // If this user is already a suspect, update their record
    const existingSuspect = existingSuspects.find((s) => s.userId === checkDto.userId)

    if (existingSuspect) {
      existingSuspect.riskScore += 10 // Increment risk score on repeated detection
      return this.fraudSuspectRepository.save(existingSuspect)
    }

    // Otherwise create a new suspect
    const newSuspect = this.fraudSuspectRepository.create({
      userId: checkDto.userId,
      ipAddress: checkDto.ipAddress,
      deviceFingerprint: checkDto.deviceFingerprint,
      metadata: checkDto.metadata || {},
      riskScore: 50, // Initial risk score
      status: FraudReviewStatus.PENDING,
    })

    const savedSuspect = await this.fraudSuspectRepository.save(newSuspect)

    // Emit event for new suspect
    this.eventEmitter.emitSuspectDetected(savedSuspect)

    return savedSuspect
  }

  private async recordFraudActivity(
    suspectId: string,
    type: FraudActivityType,
    details: Record<string, any>,
    severityScore: number,
  ): Promise<FraudActivity> {
    const activity = this.fraudActivityRepository.create({
      suspectId,
      type,
      details,
      severityScore,
    })

    const savedActivity = await this.fraudActivityRepository.save(activity)

    // Emit event for new fraud activity
    this.eventEmitter.emitFraudActivityDetected(savedActivity)

    return savedActivity
  }

  private async checkSuspiciousReferral(userId: string, referrerId: string, ipAddress: string): Promise<boolean> {
    // Check if referrer and referee share the same IP
    const referrerWithSameIp = await this.fraudSuspectRepository.findOne({
      where: {
        userId: referrerId,
        ipAddress,
      },
    })

    if (referrerWithSameIp) {
      return true // Suspicious if same IP
    }

    // Check for circular referrals (A refers B, B refers C, C refers A)
    // This requires a more complex query to detect referral chains
    // For simplicity, we'll check if this user has referred the referrer
    const referralChain = await this.checkReferralChain(userId, referrerId)

    return referralChain
  }

  private async checkReferralChain(userId: string, referrerId: string): Promise<boolean> {
    // This is a simplified implementation
    // In a real system, you would query your referral table to check for circular references

    // For now, we'll just check if there are multiple accounts from the same IP
    // that have referred each other
    const recentActivities = await this.fraudActivityRepository.find({
      where: {
        type: FraudActivityType.SUSPICIOUS_REFERRAL,
        details: { referrerId },
      },
      order: {
        detectedAt: "DESC",
      },
      take: 5,
    })

    // If we find activities where this referrer was involved in suspicious referrals before
    return recentActivities.length > 0
  }

  async getSuspects(queryDto: FraudSuspectQueryDto): Promise<FraudSuspect[]> {
    const where: FindOptionsWhere<FraudSuspect> = {}

    if (queryDto.status) {
      where.status = queryDto.status
    }

    if (queryDto.ipAddress) {
      where.ipAddress = queryDto.ipAddress
    }

    if (queryDto.userId) {
      where.userId = queryDto.userId
    }

    if (queryDto.fromDate && queryDto.toDate) {
      where.createdAt = Between(new Date(queryDto.fromDate), new Date(queryDto.toDate))
    } else if (queryDto.fromDate) {
      where.createdAt = MoreThan(new Date(queryDto.fromDate))
    }

    return this.fraudSuspectRepository.find({
      where,
      relations: ["activities"],
      order: {
        riskScore: "DESC",
        createdAt: "DESC",
      },
    })
  }

  async getSuspectById(id: string): Promise<FraudSuspect> {
    return this.fraudSuspectRepository.findOne({
      where: { id },
      relations: ["activities"],
    })
  }

  async reviewSuspect(id: string, updateDto: UpdateFraudReviewDto): Promise<FraudSuspect> {
    const suspect = await this.fraudSuspectRepository.findOneBy({ id })

    if (!suspect) {
      throw new Error("Suspect not found")
    }

    suspect.status = updateDto.status
    suspect.reviewedBy = updateDto.reviewedBy
    suspect.reviewedAt = new Date()
    suspect.reviewNotes = updateDto.reviewNotes || null

    const updatedSuspect = await this.fraudSuspectRepository.save(suspect)

    // Emit event for suspect review
    this.eventEmitter.emitSuspectReviewed(updatedSuspect)

    return updatedSuspect
  }

  async getActivityStats(): Promise<any> {
    // Get count of activities by type for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const stats = await this.fraudActivityRepository
      .createQueryBuilder("activity")
      .select("activity.type", "type")
      .addSelect("COUNT(*)", "count")
      .where("activity.detectedAt > :date", { date: thirtyDaysAgo })
      .groupBy("activity.type")
      .getRawMany()

    return stats
  }
}

