import { Injectable } from "@nestjs/common"
import { type Repository, MoreThan } from "typeorm"
import type { PuzzleSubmission } from "../entities/puzzle-submission.entity"

export interface RateLimitResult {
  allowed: boolean
  remainingAttempts: number
  resetTime: Date
  message?: string
}

@Injectable()
export class RateLimitService {
  private readonly RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
  private readonly MAX_ATTEMPTS_PER_WINDOW = 5
  private readonly GLOBAL_DAILY_LIMIT = 50

  constructor(private submissionRepository: Repository<PuzzleSubmission>) {}

  async checkRateLimit(userId: string, challengeId?: string): Promise<RateLimitResult> {
    const now = new Date()
    const windowStart = new Date(now.getTime() - this.RATE_LIMIT_WINDOW)

    // Check per-challenge rate limit
    if (challengeId) {
      const recentSubmissions = await this.submissionRepository.count({
        where: {
          userId,
          challengeId,
          createdAt: MoreThan(windowStart),
        },
      })

      if (recentSubmissions >= this.MAX_ATTEMPTS_PER_WINDOW) {
        const resetTime = new Date(now.getTime() + this.RATE_LIMIT_WINDOW)
        return {
          allowed: false,
          remainingAttempts: 0,
          resetTime,
          message: `Rate limit exceeded. Try again after ${resetTime.toLocaleTimeString()}`,
        }
      }
    }

    // Check global daily limit
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const todaySubmissions = await this.submissionRepository.count({
      where: {
        userId,
        createdAt: MoreThan(todayStart),
      },
    })

    if (todaySubmissions >= this.GLOBAL_DAILY_LIMIT) {
      const resetTime = new Date(todayStart)
      resetTime.setDate(resetTime.getDate() + 1)

      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime,
        message: "Daily submission limit reached. Try again tomorrow.",
      }
    }

    const remainingAttempts = challengeId
      ? this.MAX_ATTEMPTS_PER_WINDOW -
        (await this.submissionRepository.count({
          where: { userId, challengeId, createdAt: MoreThan(windowStart) },
        }))
      : this.GLOBAL_DAILY_LIMIT - todaySubmissions

    return {
      allowed: true,
      remainingAttempts,
      resetTime: new Date(now.getTime() + this.RATE_LIMIT_WINDOW),
    }
  }

  async getRateLimitStatus(userId: string): Promise<{
    globalLimit: { used: number; limit: number; resetTime: Date }
    recentActivity: { submissions: number; window: string }
  }> {
    const now = new Date()
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const windowStart = new Date(now.getTime() - this.RATE_LIMIT_WINDOW)

    const todaySubmissions = await this.submissionRepository.count({
      where: { userId, createdAt: MoreThan(todayStart) },
    })

    const recentSubmissions = await this.submissionRepository.count({
      where: { userId, createdAt: MoreThan(windowStart) },
    })

    const resetTime = new Date(todayStart)
    resetTime.setDate(resetTime.getDate() + 1)

    return {
      globalLimit: {
        used: todaySubmissions,
        limit: this.GLOBAL_DAILY_LIMIT,
        resetTime,
      },
      recentActivity: {
        submissions: recentSubmissions,
        window: "1 minute",
      },
    }
  }
}
