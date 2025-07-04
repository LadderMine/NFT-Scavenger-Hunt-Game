import { Injectable, Logger, BadRequestException, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import { type Feedback, TargetType } from "../entities/feedback.entity"
import type {
  CreateFeedbackDto,
  FeedbackResponse,
  FeedbackStats,
  FeedbackFilters,
  UpdateFeedbackDto,
} from "../interfaces/feedback.interface"

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name)

  constructor(feedbackRepository: Repository<Feedback>) {
    this.feedbackRepository = feedbackRepository
  }

  private feedbackRepository: Repository<Feedback>

  /**
   * Create new feedback entry
   */
  async createFeedback(
    feedbackData: CreateFeedbackDto,
    userId?: string,
    ipAddress?: string,
  ): Promise<FeedbackResponse> {
    this.logger.log(`Creating feedback: ${feedbackData.targetType} - Rating: ${feedbackData.rating}`)

    // Validate rating
    if (feedbackData.rating < 1 || feedbackData.rating > 5) {
      throw new BadRequestException("Rating must be between 1 and 5")
    }

    // Validate target type
    if (!Object.values(TargetType).includes(feedbackData.targetType)) {
      throw new BadRequestException("Invalid target type")
    }

    // Create feedback entity
    const feedback = this.feedbackRepository.create({
      rating: feedbackData.rating,
      comment: feedbackData.comment?.trim() || null,
      targetType: feedbackData.targetType,
      targetId: feedbackData.targetId || null,
      userId: feedbackData.isAnonymous ? null : userId,
      isAnonymous: feedbackData.isAnonymous || false,
      metadata: {
        ...feedbackData.metadata,
        ipAddress: feedbackData.isAnonymous ? null : ipAddress,
        submittedAt: new Date().toISOString(),
      },
    })

    const savedFeedback = await this.feedbackRepository.save(feedback)

    this.logger.log(`Feedback created successfully: ${savedFeedback.id}`)

    return this.mapToResponse(savedFeedback)
  }

  /**
   * Get all feedback (admin only)
   */
  async getAllFeedback(
    filters?: FeedbackFilters,
    page = 1,
    limit = 50,
  ): Promise<{
    feedback: FeedbackResponse[]
    total: number
    page: number
    totalPages: number
  }> {
    this.logger.log(`Fetching feedback with filters: ${JSON.stringify(filters)}`)

    const queryBuilder = this.feedbackRepository.createQueryBuilder("feedback")

    // Apply filters
    if (filters?.targetType) {
      queryBuilder.andWhere("feedback.targetType = :targetType", { targetType: filters.targetType })
    }

    if (filters?.rating) {
      queryBuilder.andWhere("feedback.rating = :rating", { rating: filters.rating })
    }

    if (filters?.isAnonymous !== undefined) {
      queryBuilder.andWhere("feedback.isAnonymous = :isAnonymous", { isAnonymous: filters.isAnonymous })
    }

    if (filters?.isResolved !== undefined) {
      queryBuilder.andWhere("feedback.isResolved = :isResolved", { isResolved: filters.isResolved })
    }

    if (filters?.userId) {
      queryBuilder.andWhere("feedback.userId = :userId", { userId: filters.userId })
    }

    if (filters?.targetId) {
      queryBuilder.andWhere("feedback.targetId = :targetId", { targetId: filters.targetId })
    }

    if (filters?.startDate) {
      queryBuilder.andWhere("feedback.createdAt >= :startDate", { startDate: filters.startDate })
    }

    if (filters?.endDate) {
      queryBuilder.andWhere("feedback.createdAt <= :endDate", { endDate: filters.endDate })
    }

    // Get total count
    const total = await queryBuilder.getCount()

    // Apply pagination and ordering
    const feedback = await queryBuilder
      .orderBy("feedback.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getMany()

    const totalPages = Math.ceil(total / limit)

    return {
      feedback: feedback.map((f) => this.mapToResponse(f)),
      total,
      page,
      totalPages,
    }
  }

  /**
   * Get feedback statistics
   */
  async getFeedbackStats(): Promise<FeedbackStats> {
    this.logger.log("Calculating feedback statistics")

    const [
      totalFeedback,
      averageRatingResult,
      ratingDistribution,
      feedbackByType,
      anonymousFeedback,
      resolvedFeedback,
      recentFeedback,
    ] = await Promise.all([
      // Total feedback count
      this.feedbackRepository.count(),

      // Average rating
      this.feedbackRepository
        .createQueryBuilder("feedback")
        .select("AVG(feedback.rating)", "average")
        .getRawOne(),

      // Rating distribution
      this.feedbackRepository
        .createQueryBuilder("feedback")
        .select("feedback.rating", "rating")
        .addSelect("COUNT(*)", "count")
        .groupBy("feedback.rating")
        .getRawMany(),

      // Feedback by type
      this.feedbackRepository
        .createQueryBuilder("feedback")
        .select("feedback.targetType", "targetType")
        .addSelect("COUNT(*)", "count")
        .groupBy("feedback.targetType")
        .getRawMany(),

      // Anonymous feedback count
      this.feedbackRepository.count({ where: { isAnonymous: true } }),

      // Resolved feedback count
      this.feedbackRepository.count({ where: { isResolved: true } }),

      // Recent feedback (last 7 days)
      this.feedbackRepository.count({
        where: {
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ])

    // Process rating distribution
    const ratingDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    ratingDistribution.forEach((item) => {
      ratingDist[item.rating] = Number.parseInt(item.count)
    })

    // Process feedback by type
    const typeDistribution = {
      [TargetType.PUZZLE]: 0,
      [TargetType.APP]: 0,
      [TargetType.EDUCATION]: 0,
    }
    feedbackByType.forEach((item) => {
      typeDistribution[item.targetType] = Number.parseInt(item.count)
    })

    return {
      totalFeedback,
      averageRating: Number.parseFloat(averageRatingResult?.average || "0"),
      ratingDistribution: ratingDist,
      feedbackByType: typeDistribution,
      anonymousFeedback,
      resolvedFeedback,
      recentFeedback,
    }
  }

  /**
   * Update feedback (admin only)
   */
  async updateFeedback(id: string, updateData: UpdateFeedbackDto): Promise<FeedbackResponse> {
    this.logger.log(`Updating feedback: ${id}`)

    const feedback = await this.feedbackRepository.findOne({ where: { id } })

    if (!feedback) {
      throw new NotFoundException("Feedback not found")
    }

    // Update fields
    if (updateData.isResolved !== undefined) {
      feedback.isResolved = updateData.isResolved
    }

    if (updateData.adminNotes !== undefined) {
      feedback.adminNotes = updateData.adminNotes?.trim() || null
    }

    const updatedFeedback = await this.feedbackRepository.save(feedback)

    this.logger.log(`Feedback updated successfully: ${id}`)

    return this.mapToResponse(updatedFeedback)
  }

  /**
   * Delete feedback (admin only)
   */
  async deleteFeedback(id: string): Promise<void> {
    this.logger.log(`Deleting feedback: ${id}`)

    const result = await this.feedbackRepository.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException("Feedback not found")
    }

    this.logger.log(`Feedback deleted successfully: ${id}`)
  }

  /**
   * Get feedback by target
   */
  async getFeedbackByTarget(
    targetType: TargetType,
    targetId?: string,
  ): Promise<{
    feedback: FeedbackResponse[]
    stats: {
      averageRating: number
      totalCount: number
      ratingDistribution: { [key: number]: number }
    }
  }> {
    this.logger.log(`Getting feedback for ${targetType}${targetId ? ` - ${targetId}` : ""}`)

    const queryBuilder = this.feedbackRepository
      .createQueryBuilder("feedback")
      .where("feedback.targetType = :targetType", { targetType })

    if (targetId) {
      queryBuilder.andWhere("feedback.targetId = :targetId", { targetId })
    }

    const feedback = await queryBuilder.orderBy("feedback.createdAt", "DESC").getMany()

    // Calculate stats
    const totalCount = feedback.length
    const averageRating = totalCount > 0 ? feedback.reduce((sum, f) => sum + f.rating, 0) / totalCount : 0

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    feedback.forEach((f) => {
      ratingDistribution[f.rating]++
    })

    return {
      feedback: feedback.map((f) => this.mapToResponse(f)),
      stats: {
        averageRating: Number.parseFloat(averageRating.toFixed(2)),
        totalCount,
        ratingDistribution,
      },
    }
  }

  /**
   * Map entity to response DTO
   */
  private mapToResponse(feedback: Feedback): FeedbackResponse {
    return {
      id: feedback.id,
      rating: feedback.rating,
      comment: feedback.comment,
      targetType: feedback.targetType,
      targetId: feedback.targetId,
      isAnonymous: feedback.isAnonymous,
      userId: feedback.isAnonymous ? undefined : feedback.userId,
      metadata: feedback.metadata,
      isResolved: feedback.isResolved,
      adminNotes: feedback.adminNotes,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    }
  }
}
