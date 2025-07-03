import { Injectable, Logger } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import type { Repository } from "typeorm"
import { type Challenge, ChallengeStatus } from "../entities/challenge.entity"

@Injectable()
export class RotationService {
  private readonly logger = new Logger(RotationService.name)

  constructor(private challengeRepository: Repository<Challenge>) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async rotateDailyChallenges() {
    this.logger.log("Starting daily challenge rotation...")

    try {
      const now = new Date()
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      // Archive expired challenges
      await this.challengeRepository.update(
        {
          status: ChallengeStatus.ACTIVE,
          expiryTime: now,
        },
        {
          status: ChallengeStatus.ARCHIVED,
        },
      )

      // Activate challenges that should unlock today
      const challengesToActivate = await this.challengeRepository.find({
        where: {
          status: ChallengeStatus.DRAFT,
          unlockTime: today,
        },
      })

      for (const challenge of challengesToActivate) {
        challenge.status = ChallengeStatus.ACTIVE
        await this.challengeRepository.save(challenge)
        this.logger.log(`Activated challenge: ${challenge.title}`)
      }

      this.logger.log(`Daily rotation completed. Activated ${challengesToActivate.length} challenges.`)
    } catch (error) {
      this.logger.error("Error during daily challenge rotation:", error)
    }
  }

  @Cron(CronExpression.EVERY_WEEK)
  async rotateWeeklyChallenges() {
    this.logger.log("Starting weekly challenge rotation...")

    try {
      const now = new Date()
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
      startOfWeek.setHours(0, 0, 0, 0)

      // Archive last week's weekly challenges
      await this.challengeRepository.update(
        {
          status: ChallengeStatus.ACTIVE,
          metadata: { type: "weekly" },
          unlockTime: startOfWeek,
        },
        {
          status: ChallengeStatus.ARCHIVED,
        },
      )

      // Activate this week's challenges
      const challengesToActivate = await this.challengeRepository.find({
        where: {
          status: ChallengeStatus.DRAFT,
          unlockTime: startOfWeek,
          metadata: { type: "weekly" },
        },
      })

      for (const challenge of challengesToActivate) {
        challenge.status = ChallengeStatus.ACTIVE
        await this.challengeRepository.save(challenge)
        this.logger.log(`Activated weekly challenge: ${challenge.title}`)
      }

      this.logger.log(`Weekly rotation completed. Activated ${challengesToActivate.length} challenges.`)
    } catch (error) {
      this.logger.error("Error during weekly challenge rotation:", error)
    }
  }

  async scheduleChallenge(challengeId: string, unlockTime: Date, expiryTime?: Date): Promise<void> {
    const challenge = await this.challengeRepository.findOne({
      where: { id: challengeId },
    })

    if (!challenge) {
      throw new Error(`Challenge with ID ${challengeId} not found`)
    }

    challenge.unlockTime = unlockTime
    challenge.expiryTime = expiryTime || null
    challenge.status = ChallengeStatus.DRAFT // Will be activated by cron job

    await this.challengeRepository.save(challenge)
    this.logger.log(`Scheduled challenge "${challenge.title}" for ${unlockTime.toISOString()}`)
  }

  async getUpcomingChallenges(): Promise<Challenge[]> {
    const now = new Date()
    return this.challengeRepository.find({
      where: {
        status: ChallengeStatus.DRAFT,
        unlockTime: now,
      },
      order: { unlockTime: "ASC" },
    })
  }

  async getArchivedChallenges(): Promise<Challenge[]> {
    return this.challengeRepository.find({
      where: { status: ChallengeStatus.ARCHIVED },
      order: { updatedAt: "DESC" },
    })
  }
}
