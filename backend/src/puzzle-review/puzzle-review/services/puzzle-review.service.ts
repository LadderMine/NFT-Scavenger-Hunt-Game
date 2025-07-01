import { Injectable, Logger, NotFoundException, BadRequestException, ConflictException } from "@nestjs/common"
import type { Repository } from "typeorm"
import { type PuzzleReview, ReviewStatus, ReviewType } from "../entities/puzzle-review.entity"
import type {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewResponse,
  ReviewFilters,
  PuzzleReviewSummary,
  ReviewStats,
  ReviewValidationResult,
} from "../interfaces/review.interface"

@Injectable()
export class PuzzleReviewService {
  private readonly logger = new Logger(PuzzleReviewService.name)

  constructor(private readonly reviewRepository: Repository<PuzzleReview>) {}

  /**
   * Create a new review
   */
  async createReview(reviewData: CreateReviewDto, ipAddress?: string): Promise<ReviewResponse> {
    this.logger.log(`Creating review for puzzle: ${reviewData.puzzleId}`)

    try {
      // Validate review data
      const validation = await this.validateReview(reviewData)
      if (!validation.isValid) {
        throw new BadRequestException(`Invalid review data: ${validation.errors.join(", ")}`)
      }

      // Check for existing review from same user
      if (reviewData.userId) {
        const existingReview = await this.reviewRepository.findOne({
          where: {
            puzzleId: reviewData.puzzleId,
            userId: reviewData.userId,
          },
        })

        if (existingReview) {
          throw new ConflictException("User has already reviewed this puzzle")
        }
      }

      // Determine review type
      const reviewType = this.determineReviewType(reviewData)

      // Create review entity
      const review = this.reviewRepository.create({
        puzzleId: reviewData.puzzleId,
        userId: reviewData.isAnonymous ? null : reviewData.userId,
        username: reviewData.username || "Anonymous",
        rating: reviewData.rating,
        reviewText: reviewData.reviewText?.trim() || null,
        reviewType,
        status: this.shouldAutoApprove(reviewData, validation) ? ReviewStatus.APPROVED : ReviewStatus.PENDING,
        isAnonymous: reviewData.isAnonymous || false,
        tags: reviewData.tags || [],
        metadata: {
          ...reviewData.metadata,
          ipAddress: reviewData.isAnonymous ? null : ipAddress,
          submittedAt: new Date().toISOString(),
        },
        moderationInfo:
          validation.autoModerationFlags.length > 0 ? { flaggedReasons: validation.autoModerationFlags } : null,
      })

      const savedReview = await this.reviewRepository.save(review)

      this.logger.log(`Review created successfully: ${savedReview.id}`)

      return this.mapToResponse(savedReview)
    } catch (error) {
      this.logger.error(`Failed to create review: ${error.message}`)
      throw error
    }
  }

  /**
   * Update an existing review
   */
  async updateReview(id: string, updateData: UpdateReviewDto, userId?: string): Promise<ReviewResponse> {
    this.logger.log(`Updating review: ${id}`)

    const review = await this.reviewRepository.findOne({ where: { id } })

    if (!review) {
      throw new NotFoundException("Review not found")
    }

    // Check ownership (if not anonymous)
    if (userId && review.userId !== userId) {
      throw new BadRequestException("You can only edit your own reviews")
    }

    // Validate update data
    const validation = await this.validateReview({ ...updateData, puzzleId: review.puzzleId } as CreateReviewDto)
    if (!validation.isValid) {
      throw new BadRequestException(`Invalid update data: ${validation.errors.join(", ")}`)
    }

    // Update fields
    if (updateData.rating !== undefined) {
      review.rating = updateData.rating
    }

    if (updateData.reviewText !== undefined) {
      review.reviewText = updateData.reviewText?.trim() || null
      review.reviewType = this.determineReviewType({
        rating: review.rating,
        reviewText: review.reviewText,
      } as CreateReviewDto)
    }

    if (updateData.tags !== undefined) {
      review.tags = updateData.tags
    }

    if (updateData.metadata) {
      review.metadata = { ...review.metadata, ...updateData.metadata }
    }

    // Mark as edited
    review.isEdited = true
    review.editedAt = new Date()

    // Reset status to pending if significant changes
    if (updateData.rating !== undefined || updateData.reviewText !== undefined) {
      review.status = ReviewStatus.PENDING
    }

    const updatedReview = await this.reviewRepository.save(review)

    this.logger.log(`Review updated successfully: ${id}`)

    return this.mapToResponse(updatedReview)
  }

  /**
   * Delete a review
   */
  async deleteReview(id: string, userId?: string): Promise<void> {
    this.logger.log(`Deleting review: ${id}`)

    const review = await this.reviewRepository.findOne({ where: { id } })

    if (!review) {
      throw new NotFoundException("Review not found")
    }

    // Check ownership (if not anonymous)
    if (userId && review.userId !== userId) {
      throw new BadRequestException("You can only delete your own reviews")
    }

    // Soft delete by updating status
    review.status = ReviewStatus.DELETED
    await this.reviewRepository.save(review)

    this.logger.log(`Review deleted successfully: ${id}`)
  }

  /**
   * Get review by ID
   */
  async getReview(id: string): Promise<ReviewResponse> {
    const review = await this.reviewRepository.findOne({ where: { id } })

    if (!review) {
      throw new NotFoundException("Review not found")
    }

    return this.mapToResponse(review)
  }

  /**
   * Get reviews with filters and pagination
   */
  async getReviews(
    filters?: ReviewFilters,
    page = 1,
    limit = 20,
  ): Promise<{
    reviews: ReviewResponse[]
    total: number
    page: number
    totalPages: number
  }> {
    this.logger.log(`Fetching reviews with filters: ${JSON.stringify(filters)}`)

    const queryBuilder = this.reviewRepository.createQueryBuilder("review")

    // Apply filters
    if (filters?.puzzleId) {
      queryBuilder.andWhere("review.puzzleId = :puzzleId", { puzzleId: filters.puzzleId })
    }

    if (filters?.userId) {
      queryBuilder.andWhere("review.userId = :userId", { userId: filters.userId })
    }

    if (filters?.status) {
      queryBuilder.andWhere("review.status = :status", { status: filters.status })
    } else {
      // Default to approved reviews for public access
      queryBuilder.andWhere("review.status = :status", { status: ReviewStatus.APPROVED })
    }

    if (filters?.rating) {
      queryBuilder.andWhere("review.rating = :rating", { rating: filters.rating })
    }

    if (filters?.minRating) {
      queryBuilder.andWhere("review.rating >= :minRating", { minRating: filters.minRating })
    }

    if (filters?.maxRating) {
      queryBuilder.andWhere("review.rating <= :maxRating", { maxRating: filters.maxRating })
    }

    if (filters?.reviewType) {
      queryBuilder.andWhere("review.reviewType = :reviewType", { reviewType: filters.reviewType })
    }

    if (filters?.isAnonymous !== undefined) {
      queryBuilder.andWhere("review.isAnonymous = :isAnonymous", { isAnonymous: filters.isAnonymous })
    }

    if (filters?.startDate) {
      queryBuilder.andWhere("review.createdAt >= :startDate", { startDate: filters.startDate })
    }

    if (filters?.endDate) {
      queryBuilder.andWhere("review.createdAt <= :endDate", { endDate: filters.endDate })
    }

    if (filters?.tags && filters.tags.length > 0) {
      queryBuilder.andWhere("review.tags && :tags", { tags: filters.tags })
    }

    // Get total count
    const total = await queryBuilder.getCount()

    // Apply sorting
    const sortBy = filters?.sortBy || "createdAt"
    const sortOrder = filters?.sortOrder || "DESC"
    queryBuilder.orderBy(`review.${sortBy}`, sortOrder)

    // Apply pagination
    const reviews = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany()

    const totalPages = Math.ceil(total / limit)

    return {
      reviews: reviews.map((review) => this.mapToResponse(review)),
      total,
      page,
      totalPages,
    }
  }

  /**
   * Get puzzle review summary
   */
  async getPuzzleReviewSummary(puzzleId: string): Promise<PuzzleReviewSummary> {
    this.logger.log(`Getting review summary for puzzle: ${puzzleId}`)

    const [totalReviews, averageRating, ratingDistribution, statusDistribution, recentReviews, topTags] =
      await Promise.all([
        // Total reviews
        this.reviewRepository.count({
          where: { puzzleId, status: ReviewStatus.APPROVED },
        }),

        // Average rating
        this.reviewRepository
          .createQueryBuilder("review")
          .select("AVG(review.rating)", "average")
          .where("review.puzzleId = :puzzleId", { puzzleId })
          .andWhere("review.status = :status", { status: ReviewStatus.APPROVED })
          .getRawOne(),

        // Rating distribution
        this.reviewRepository
          .createQueryBuilder("review")
          .select("review.rating", "rating")
          .addSelect("COUNT(*)", "count")
          .where("review.puzzleId = :puzzleId", { puzzleId })
          .andWhere("review.status = :status", { status: ReviewStatus.APPROVED })
          .groupBy("review.rating")
          .getRawMany(),

        // Status distribution
        this.reviewRepository
          .createQueryBuilder("review")
          .select("review.status", "status")
          .addSelect("COUNT(*)", "count")
          .where("review.puzzleId = :puzzleId", { puzzleId })
          .groupBy("review.status")
          .getRawMany(),

        // Recent reviews (last 7 days)
        this.reviewRepository.count({
          where: {
            puzzleId,
            status: ReviewStatus.APPROVED,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        }),

        // Top tags
        this.reviewRepository
          .createQueryBuilder("review")
          .select("unnest(review.tags)", "tag")
          .addSelect("COUNT(*)", "count")
          .where("review.puzzleId = :puzzleId", { puzzleId })
          .andWhere("review.status = :status", { status: ReviewStatus.APPROVED })
          .andWhere("review.tags IS NOT NULL")
          .groupBy("tag")
          .orderBy("count", "DESC")
          .limit(10)
          .getRawMany(),
      ])

    // Process rating distribution
    const ratingDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    ratingDistribution.forEach((item) => {
      ratingDist[item.rating] = Number.parseInt(item.count)
    })

    // Process status distribution
    const statusDist = Object.values(ReviewStatus).reduce(
      (acc, status) => {
        acc[status] = 0
        return acc
      },
      {} as Record<ReviewStatus, number>,
    )
    statusDistribution.forEach((item) => {
      statusDist[item.status] = Number.parseInt(item.count)
    })

    return {
      puzzleId,
      totalReviews,
      averageRating: Number.parseFloat(averageRating?.average || "0"),
      ratingDistribution: ratingDist,
      reviewsByStatus: statusDist,
      recentReviews,
      topTags: topTags.map((item) => ({
        tag: item.tag,
        count: Number.parseInt(item.count),
      })),
    }
  }

  /**
   * Get comprehensive review statistics
   */
  async getReviewStats(): Promise<ReviewStats> {
    this.logger.log("Calculating review statistics")

    const [
      totalReviews,
      averageRating,
      statusDistribution,
      typeDistribution,
      anonymousReviews,
      recentActivity,
      moderationStats,
    ] = await Promise.all([
      // Total reviews
      this.reviewRepository.count(),

      // Average rating
      this.reviewRepository
        .createQueryBuilder("review")
        .select("AVG(review.rating)", "average")
        .where("review.status = :status", { status: ReviewStatus.APPROVED })
        .getRawOne(),

      // Status distribution
      this.reviewRepository
        .createQueryBuilder("review")
        .select("review.status", "status")
        .addSelect("COUNT(*)", "count")
        .groupBy("review.status")
        .getRawMany(),

      // Type distribution
      this.reviewRepository
        .createQueryBuilder("review")
        .select("review.reviewType", "reviewType")
        .addSelect("COUNT(*)", "count")
        .groupBy("review.reviewType")
        .getRawMany(),

      // Anonymous reviews
      this.reviewRepository.count({ where: { isAnonymous: true } }),

      // Recent activity
      Promise.all([
        this.reviewRepository.count({
          where: { createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        }),
        this.reviewRepository.count({
          where: { createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        }),
        this.reviewRepository.count({
          where: { createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }),
      ]),

      // Moderation stats
      Promise.all([
        this.reviewRepository.count({ where: { status: ReviewStatus.PENDING } }),
        this.reviewRepository.count({ where: { status: ReviewStatus.FLAGGED } }),
        this.reviewRepository.count({
          where: [{ status: ReviewStatus.REJECTED }, { status: ReviewStatus.DELETED }],
        }),
      ]),
    ])

    // Process distributions
    const statusDist = Object.values(ReviewStatus).reduce(
      (acc, status) => {
        acc[status] = 0
        return acc
      },
      {} as Record<ReviewStatus, number>,
    )
    statusDistribution.forEach((item) => {
      statusDist[item.status] = Number.parseInt(item.count)
    })

    const typeDist = Object.values(ReviewType).reduce(
      (acc, type) => {
        acc[type] = 0
        return acc
      },
      {} as Record<ReviewType, number>,
    )
    typeDistribution.forEach((item) => {
      typeDist[item.reviewType] = Number.parseInt(item.count)
    })

    return {
      totalReviews,
      averageRating: Number.parseFloat(averageRating?.average || "0"),
      reviewsByStatus: statusDist,
      reviewsByType: typeDist,
      anonymousReviews,
      recentActivity: {
        last24Hours: recentActivity[0],
        last7Days: recentActivity[1],
        last30Days: recentActivity[2],
      },
      moderationStats: {
        pendingReviews: moderationStats[0],
        flaggedReviews: moderationStats[1],
        totalModerations: moderationStats[2],
      },
    }
  }

  /**
   * Mark review as helpful
   */
  async markReviewHelpful(id: string): Promise<ReviewResponse> {
    this.logger.log(`Marking review as helpful: ${id}`)

    const review = await this.reviewRepository.findOne({ where: { id } })

    if (!review) {
      throw new NotFoundException("Review not found")
    }

    review.helpfulCount += 1
    const updatedReview = await this.reviewRepository.save(review)

    return this.mapToResponse(updatedReview)
  }

  /**
   * Report a review
   */
  async reportReview(id: string, reason?: string): Promise<ReviewResponse> {
    this.logger.log(`Reporting review: ${id}`)

    const review = await this.reviewRepository.findOne({ where: { id } })

    if (!review) {
      throw new NotFoundException("Review not found")
    }

    review.reportCount += 1

    // Auto-flag if report count exceeds threshold
    if (review.reportCount >= 3 && review.status === ReviewStatus.APPROVED) {
      review.status = ReviewStatus.FLAGGED
      review.moderationInfo = {
        ...review.moderationInfo,
        autoModerated: true,
        flaggedReasons: [...(review.moderationInfo?.flaggedReasons || []), "multiple_reports"],
      }
    }

    const updatedReview = await this.reviewRepository.save(review)

    return this.mapToResponse(updatedReview)
  }

  /**
   * Validate review data
   */
  private async validateReview(reviewData: Partial<CreateReviewDto>): Promise<ReviewValidationResult> {
    const errors: string[] = []
    const warnings: string[] = []
    const autoModerationFlags: string[] = []

    // Validate rating
    if (reviewData.rating === undefined || reviewData.rating < 1 || reviewData.rating > 5) {
      errors.push("Rating must be between 1 and 5")
    }

    // Validate review text length
    if (reviewData.reviewText && reviewData.reviewText.length > 2000) {
      errors.push("Review text cannot exceed 2000 characters")
    }

    // Check for inappropriate content (basic checks)
    if (reviewData.reviewText) {
      const inappropriateWords = ["spam", "fake", "terrible", "worst"] // Simplified list
      const hasInappropriateContent = inappropriateWords.some((word) =>
        reviewData.reviewText!.toLowerCase().includes(word),
      )

      if (hasInappropriateContent) {
        autoModerationFlags.push("potential_inappropriate_content")
        warnings.push("Review may contain inappropriate content")
      }

      // Check for very short reviews
      if (reviewData.reviewText.trim().length < 10) {
        warnings.push("Review text is very short")
      }
    }

    // Validate tags
    if (reviewData.tags && reviewData.tags.length > 10) {
      errors.push("Cannot have more than 10 tags")
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      autoModerationFlags,
    }
  }

  /**
   * Determine review type based on content
   */
  private determineReviewType(reviewData: Partial<CreateReviewDto>): ReviewType {
    if (!reviewData.reviewText || reviewData.reviewText.trim().length === 0) {
      return ReviewType.RATING_ONLY
    }

    if (reviewData.reviewText.length > 100) {
      return ReviewType.DETAILED_REVIEW
    }

    return ReviewType.REVIEW_WITH_RATING
  }

  /**
   * Determine if review should be auto-approved
   */
  private shouldAutoApprove(reviewData: CreateReviewDto, validation: ReviewValidationResult): boolean {
    // Auto-approve if no moderation flags and rating is reasonable
    return validation.autoModerationFlags.length === 0 && reviewData.rating >= 2
  }

  /**
   * Map entity to response DTO
   */
  private mapToResponse(review: PuzzleReview): ReviewResponse {
    return {
      id: review.id,
      puzzleId: review.puzzleId,
      userId: review.isAnonymous ? undefined : review.userId,
      username: review.username,
      rating: review.rating,
      reviewText: review.reviewText,
      reviewType: review.reviewType,
      status: review.status,
      isAnonymous: review.isAnonymous,
      isEdited: review.isEdited,
      editedAt: review.editedAt,
      tags: review.tags,
      helpfulCount: review.helpfulCount,
      reportCount: review.reportCount,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }
  }
}
