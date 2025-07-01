import { Injectable, Logger, NotFoundException, BadRequestException } from "@nestjs/common"
import type { Repository } from "typeorm"
import { type PuzzleReview, ReviewStatus } from "../entities/puzzle-review.entity"
import { type ReviewModeration, ModerationAction, ModerationReason } from "../entities/review-moderation.entity"
import type { ModerationRequest, ModerationResponse } from "../interfaces/review.interface"

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name)

  constructor(
    private readonly reviewRepository: Repository<PuzzleReview>,
    private readonly moderationRepository: Repository<ReviewModeration>,
  ) {}

  /**
   * Moderate a review
   */
  async moderateReview(moderationRequest: ModerationRequest): Promise<ModerationResponse> {
    this.logger.log(`Moderating review: ${moderationRequest.reviewId} - Action: ${moderationRequest.action}`)

    const review = await this.reviewRepository.findOne({
      where: { id: moderationRequest.reviewId },
    })

    if (!review) {
      throw new NotFoundException("Review not found")
    }

    const previousStatus = review.status
    const previousData = {
      status: review.status,
      reviewText: review.reviewText,
      rating: review.rating,
    }

    // Apply moderation action
    const newStatus = this.applyModerationAction(review, moderationRequest.action)

    // Update review moderation info
    review.moderationInfo = {
      ...review.moderationInfo,
      moderatedBy: moderationRequest.moderatorId,
      moderatedAt: new Date().toISOString(),
      moderationReason: moderationRequest.reason,
      autoModerated: false,
    }

    // Save updated review
    const updatedReview = await this.reviewRepository.save(review)

    // Create moderation record
    const moderationRecord = this.moderationRepository.create({
      reviewId: moderationRequest.reviewId,
      moderatorId: moderationRequest.moderatorId,
      action: moderationRequest.action,
      reason: moderationRequest.reason,
      notes: moderationRequest.notes,
      previousData,
      isAutoModeration: false,
    })

    const savedModeration = await this.moderationRepository.save(moderationRecord)

    this.logger.log(`Review moderated successfully: ${moderationRequest.reviewId} - ${previousStatus} -> ${newStatus}`)

    return {
      success: true,
      reviewId: moderationRequest.reviewId,
      action: moderationRequest.action,
      previousStatus,
      newStatus,
      moderationId: savedModeration.id,
    }
  }

  /**
   * Get reviews pending moderation
   */
  async getPendingReviews(
    page = 1,
    limit = 20,
  ): Promise<{
    reviews: PuzzleReview[]
    total: number
    page: number
    totalPages: number
  }> {
    this.logger.log("Fetching reviews pending moderation")

    const [reviews, total] = await this.reviewRepository.findAndCount({
      where: [{ status: ReviewStatus.PENDING }, { status: ReviewStatus.FLAGGED }],
      order: { createdAt: "ASC" }, // Oldest first for moderation queue
      skip: (page - 1) * limit,
      take: limit,
    })

    const totalPages = Math.ceil(total / limit)

    return {
      reviews,
      total,
      page,
      totalPages,
    }
  }

  /**
   * Get flagged reviews
   */
  async getFlaggedReviews(
    page = 1,
    limit = 20,
  ): Promise<{
    reviews: PuzzleReview[]
    total: number
    page: number
    totalPages: number
  }> {
    this.logger.log("Fetching flagged reviews")

    const [reviews, total] = await this.reviewRepository.findAndCount({
      where: { status: ReviewStatus.FLAGGED },
      order: { reportCount: "DESC", createdAt: "ASC" },
      skip: (page - 1) * limit,
      take: limit,
    })

    const totalPages = Math.ceil(total / limit)

    return {
      reviews,
      total,
      page,
      totalPages,
    }
  }

  /**
   * Get moderation history for a review
   */
  async getModerationHistory(reviewId: string): Promise<ReviewModeration[]> {
    this.logger.log(`Getting moderation history for review: ${reviewId}`)

    return await this.moderationRepository.find({
      where: { reviewId },
      order: { createdAt: "DESC" },
    })
  }

  /**
   * Get moderation statistics
   */
  async getModerationStats(): Promise<{
    pendingCount: number
    flaggedCount: number
    totalModerations: number
    moderationsByAction: Record<ModerationAction, number>
    moderationsByReason: Record<ModerationReason, number>
    recentModerations: number
  }> {
    this.logger.log("Calculating moderation statistics")

    const [pendingCount, flaggedCount, totalModerations, moderationsByAction, moderationsByReason, recentModerations] =
      await Promise.all([
        // Pending reviews
        this.reviewRepository.count({ where: { status: ReviewStatus.PENDING } }),

        // Flagged reviews
        this.reviewRepository.count({ where: { status: ReviewStatus.FLAGGED } }),

        // Total moderations
        this.moderationRepository.count(),

        // Moderations by action
        this.moderationRepository
          .createQueryBuilder("moderation")
          .select("moderation.action", "action")
          .addSelect("COUNT(*)", "count")
          .groupBy("moderation.action")
          .getRawMany(),

        // Moderations by reason
        this.moderationRepository
          .createQueryBuilder("moderation")
          .select("moderation.reason", "reason")
          .addSelect("COUNT(*)", "count")
          .where("moderation.reason IS NOT NULL")
          .groupBy("moderation.reason")
          .getRawMany(),

        // Recent moderations (last 7 days)
        this.moderationRepository.count({
          where: {
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        }),
      ])

    // Process distributions
    const actionDist = Object.values(ModerationAction).reduce(
      (acc, action) => {
        acc[action] = 0
        return acc
      },
      {} as Record<ModerationAction, number>,
    )
    moderationsByAction.forEach((item) => {
      actionDist[item.action] = Number.parseInt(item.count)
    })

    const reasonDist = Object.values(ModerationReason).reduce(
      (acc, reason) => {
        acc[reason] = 0
        return acc
      },
      {} as Record<ModerationReason, number>,
    )
    moderationsByReason.forEach((item) => {
      reasonDist[item.reason] = Number.parseInt(item.count)
    })

    return {
      pendingCount,
      flaggedCount,
      totalModerations,
      moderationsByAction: actionDist,
      moderationsByReason: reasonDist,
      recentModerations,
    }
  }

  /**
   * Bulk moderate reviews
   */
  async bulkModerateReviews(
    reviewIds: string[],
    action: ModerationAction,
    moderatorId: string,
    reason?: ModerationReason,
    notes?: string,
  ): Promise<ModerationResponse[]> {
    this.logger.log(`Bulk moderating ${reviewIds.length} reviews - Action: ${action}`)

    const results: ModerationResponse[] = []

    for (const reviewId of reviewIds) {
      try {
        const result = await this.moderateReview({
          reviewId,
          action,
          moderatorId,
          reason,
          notes,
        })
        results.push(result)
      } catch (error) {
        this.logger.error(`Failed to moderate review ${reviewId}: ${error.message}`)
        results.push({
          success: false,
          reviewId,
          action,
          previousStatus: ReviewStatus.PENDING,
          newStatus: ReviewStatus.PENDING,
          moderationId: "",
        } as ModerationResponse)
      }
    }

    return results
  }

  /**
   * Auto-moderate reviews based on rules
   */
  async autoModerateReviews(): Promise<number> {
    this.logger.log("Running auto-moderation")

    let moderatedCount = 0

    // Auto-approve reviews with high ratings and no flags
    const autoApproveReviews = await this.reviewRepository.find({
      where: {
        status: ReviewStatus.PENDING,
        rating: 4, // 4 or 5 stars
      },
    })

    for (const review of autoApproveReviews) {
      if (!review.moderationInfo?.flaggedReasons?.length) {
        review.status = ReviewStatus.APPROVED
        review.moderationInfo = {
          ...review.moderationInfo,
          autoModerated: true,
          moderatedAt: new Date().toISOString(),
        }

        await this.reviewRepository.save(review)

        // Create moderation record
        await this.moderationRepository.save({
          reviewId: review.id,
          moderatorId: "system",
          action: ModerationAction.APPROVE,
          reason: null,
          notes: "Auto-approved: High rating, no flags",
          isAutoModeration: true,
          previousData: { status: ReviewStatus.PENDING },
        } as any)

        moderatedCount++
      }
    }

    // Auto-flag reviews with multiple reports
    const autoFlagReviews = await this.reviewRepository.find({
      where: {
        status: ReviewStatus.APPROVED,
        reportCount: 5, // 5 or more reports
      },
    })

    for (const review of autoFlagReviews) {
      review.status = ReviewStatus.FLAGGED
      review.moderationInfo = {
        ...review.moderationInfo,
        autoModerated: true,
        moderatedAt: new Date().toISOString(),
        flaggedReasons: [...(review.moderationInfo?.flaggedReasons || []), "multiple_reports"],
      }

      await this.reviewRepository.save(review)

      // Create moderation record
      await this.moderationRepository.save({
        reviewId: review.id,
        moderatorId: "system",
        action: ModerationAction.FLAG,
        reason: ModerationReason.SPAM,
        notes: "Auto-flagged: Multiple reports",
        isAutoModeration: true,
        previousData: { status: ReviewStatus.APPROVED },
      } as any)

      moderatedCount++
    }

    this.logger.log(`Auto-moderation completed: ${moderatedCount} reviews processed`)

    return moderatedCount
  }

  /**
   * Apply moderation action to review
   */
  private applyModerationAction(review: PuzzleReview, action: ModerationAction): ReviewStatus {
    switch (action) {
      case ModerationAction.APPROVE:
        review.status = ReviewStatus.APPROVED
        return ReviewStatus.APPROVED

      case ModerationAction.REJECT:
        review.status = ReviewStatus.REJECTED
        return ReviewStatus.REJECTED

      case ModerationAction.DELETE:
        review.status = ReviewStatus.DELETED
        return ReviewStatus.DELETED

      case ModerationAction.FLAG:
        review.status = ReviewStatus.FLAGGED
        return ReviewStatus.FLAGGED

      case ModerationAction.UNFLAG:
        review.status = ReviewStatus.APPROVED
        return ReviewStatus.APPROVED

      case ModerationAction.EDIT:
        // For edit actions, status remains the same
        return review.status

      default:
        throw new BadRequestException(`Unknown moderation action: ${action}`)
    }
  }
}
