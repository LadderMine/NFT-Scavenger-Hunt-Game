import { Injectable, BadRequestException, ForbiddenException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { PuzzleSubmission } from "../entities/puzzle-submission.entity"
import type { ChallengeCompletion } from "../entities/challenge-completion.entity"
import type { HintUsage } from "../entities/hint-usage.entity"
import type { User } from "../entities/user.entity"
import { type Challenge, ChallengeType } from "../entities/challenge.entity"
import type { ChallengeService } from "./challenge.service"
import type { SubmitPuzzleDto } from "../dto/submit-puzzle.dto"
import type { RequestHintDto } from "../dto/request-hint.dto"
import * as levenshtein from "fast-levenshtein"

export interface PuzzleSubmissionResult {
  isCorrect: boolean
  message: string
  pointsEarned?: number
  attemptsRemaining: number
  isCompleted: boolean
}

export interface HintResult {
  hint: string
  hintsRemaining: number
  hintIndex: number
}

@Injectable()
export class PuzzleService {
  private submissionRepository: Repository<PuzzleSubmission>
  private completionRepository: Repository<ChallengeCompletion>
  private hintUsageRepository: Repository<HintUsage>
  private userRepository: Repository<User>
  private challengeService: ChallengeService

  constructor(
    submissionRepository: Repository<PuzzleSubmission>,
    completionRepository: Repository<ChallengeCompletion>,
    hintUsageRepository: Repository<HintUsage>,
    userRepository: Repository<User>,
    challengeService: ChallengeService,
  ) {
    this.submissionRepository = submissionRepository
    this.completionRepository = completionRepository
    this.hintUsageRepository = hintUsageRepository
    this.userRepository = userRepository
    this.challengeService = challengeService
  }

  async submitAnswer(
    userId: string,
    submitPuzzleDto: SubmitPuzzleDto,
    ipAddress?: string,
  ): Promise<PuzzleSubmissionResult> {
    const { challengeId, answer, timeTaken } = submitPuzzleDto

    // Get challenge and validate availability
    const challenge = await this.challengeService.findOneForUser(challengeId)

    // Check if user already completed this challenge
    const existingCompletion = await this.completionRepository.findOne({
      where: { userId, challengeId },
    })

    if (existingCompletion) {
      throw new BadRequestException("Challenge already completed")
    }

    // Check attempt limits
    const attemptCount = await this.submissionRepository.count({
      where: { userId, challengeId },
    })

    if (attemptCount >= challenge.maxAttempts) {
      throw new ForbiddenException("Maximum attempts exceeded")
    }

    // Evaluate answer
    const isCorrect = this.evaluateAnswer(challenge, answer)

    // Create submission record
    const submission = this.submissionRepository.create({
      userId,
      challengeId,
      submittedAnswer: answer,
      isCorrect,
      timeTaken,
      ipAddress,
    })

    await this.submissionRepository.save(submission)

    const attemptsRemaining = challenge.maxAttempts - (attemptCount + 1)

    if (isCorrect) {
      // Calculate points (reduce points for hints used)
      const hintsUsed = await this.hintUsageRepository.count({
        where: { userId, challengeId },
      })

      const pointsEarned = Math.max(
        Math.floor(challenge.points * (1 - hintsUsed * 0.1)), // 10% reduction per hint
        Math.floor(challenge.points * 0.5), // Minimum 50% of points
      )

      // Create completion record
      const completion = this.completionRepository.create({
        userId,
        challengeId,
        pointsEarned,
        attemptsUsed: attemptCount + 1,
        hintsUsed,
        totalTimeTaken: timeTaken,
      })

      await this.completionRepository.save(completion)

      // Update user stats
      await this.userRepository.increment({ id: userId }, "totalPoints", pointsEarned)
      await this.userRepository.increment({ id: userId }, "challengesCompleted", 1)

      return {
        isCorrect: true,
        message: "Congratulations! You solved the puzzle!",
        pointsEarned,
        attemptsRemaining,
        isCompleted: true,
      }
    }

    return {
      isCorrect: false,
      message:
        attemptsRemaining > 0
          ? `Incorrect answer. You have ${attemptsRemaining} attempts remaining.`
          : "Incorrect answer. No more attempts remaining.",
      attemptsRemaining,
      isCompleted: false,
    }
  }

  async requestHint(userId: string, requestHintDto: RequestHintDto): Promise<HintResult> {
    const { challengeId } = requestHintDto

    const challenge = await this.challengeService.findOneForUser(challengeId)

    // Check if user already completed this challenge
    const existingCompletion = await this.completionRepository.findOne({
      where: { userId, challengeId },
    })

    if (existingCompletion) {
      throw new BadRequestException("Cannot request hints for completed challenges")
    }

    // Check hint usage
    const hintsUsed = await this.hintUsageRepository.count({
      where: { userId, challengeId },
    })

    if (hintsUsed >= challenge.maxHints) {
      throw new ForbiddenException("Maximum hints exceeded")
    }

    if (hintsUsed >= challenge.hints.length) {
      throw new BadRequestException("No more hints available")
    }

    const hintIndex = hintsUsed
    const hint = challenge.hints[hintIndex]

    // Record hint usage
    const hintUsage = this.hintUsageRepository.create({
      userId,
      challengeId,
      hintIndex,
      hintContent: hint,
    })

    await this.hintUsageRepository.save(hintUsage)

    return {
      hint,
      hintsRemaining: challenge.maxHints - (hintsUsed + 1),
      hintIndex,
    }
  }

  private evaluateAnswer(challenge: Challenge, submittedAnswer: string): boolean {
    const correctAnswer = challenge.correctAnswer
    let userAnswer = submittedAnswer.trim()
    let expectedAnswer = correctAnswer.trim()

    // Handle case sensitivity
    if (!challenge.caseSensitive) {
      userAnswer = userAnswer.toLowerCase()
      expectedAnswer = expectedAnswer.toLowerCase()
    }

    // Handle different challenge types
    switch (challenge.type) {
      case ChallengeType.NUMBER:
        const userNum = Number.parseFloat(userAnswer)
        const expectedNum = Number.parseFloat(expectedAnswer)
        return !isNaN(userNum) && !isNaN(expectedNum) && userNum === expectedNum

      case ChallengeType.MULTIPLE_CHOICE:
        return userAnswer === expectedAnswer

      case ChallengeType.TEXT:
      case ChallengeType.CODE:
      default:
        if (challenge.fuzzyMatching) {
          // Use Levenshtein distance for fuzzy matching
          const distance = levenshtein.get(userAnswer, expectedAnswer)
          const threshold = Math.max(1, Math.floor(expectedAnswer.length * 0.1)) // 10% tolerance
          return distance <= threshold
        }
        return userAnswer === expectedAnswer
    }
  }

  async getUserProgress(userId: string): Promise<any> {
    const completions = await this.completionRepository.find({
      where: { userId },
      relations: ["challenge"],
      order: { completedAt: "DESC" },
    })

    const submissions = await this.submissionRepository.find({
      where: { userId },
      relations: ["challenge"],
      order: { createdAt: "DESC" },
    })

    const totalPoints = completions.reduce((sum, completion) => sum + completion.pointsEarned, 0)
    const challengesCompleted = completions.length

    return {
      totalPoints,
      challengesCompleted,
      completions: completions.map((completion) => ({
        challengeId: completion.challengeId,
        challengeTitle: completion.challenge.title,
        pointsEarned: completion.pointsEarned,
        completedAt: completion.completedAt,
        attemptsUsed: completion.attemptsUsed,
        hintsUsed: completion.hintsUsed,
      })),
      recentSubmissions: submissions.slice(0, 10).map((submission) => ({
        challengeId: submission.challengeId,
        challengeTitle: submission.challenge.title,
        isCorrect: submission.isCorrect,
        createdAt: submission.createdAt,
      })),
    }
  }

  async getChallengeStats(challengeId: string): Promise<any> {
    const submissions = await this.submissionRepository.find({
      where: { challengeId },
    })

    const completions = await this.completionRepository.find({
      where: { challengeId },
    })

    const totalAttempts = submissions.length
    const successfulAttempts = submissions.filter((s) => s.isCorrect).length
    const uniqueUsers = new Set(submissions.map((s) => s.userId)).size
    const completionRate = totalAttempts > 0 ? (successfulAttempts / totalAttempts) * 100 : 0

    const avgAttempts =
      completions.length > 0 ? completions.reduce((sum, c) => sum + c.attemptsUsed, 0) / completions.length : 0

    const avgHints =
      completions.length > 0 ? completions.reduce((sum, c) => sum + c.hintsUsed, 0) / completions.length : 0

    return {
      totalAttempts,
      successfulAttempts,
      uniqueUsers,
      completionRate: Math.round(completionRate * 100) / 100,
      averageAttemptsToComplete: Math.round(avgAttempts * 100) / 100,
      averageHintsUsed: Math.round(avgHints * 100) / 100,
      totalCompletions: completions.length,
    }
  }
}
