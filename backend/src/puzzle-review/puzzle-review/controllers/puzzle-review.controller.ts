import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Logger,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from "@nestjs/swagger"
import type { Request } from "express"
import type { PuzzleReviewService } from "../services/puzzle-review.service"
import { ReviewStatus, ReviewType } from "../entities/puzzle-review.entity"
import type {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewResponse,
  ReviewFilters,
  PuzzleReviewSummary,
  ReviewStats,
} from "../interfaces/review.interface"

@ApiTags("Puzzle Reviews")
@Controller("puzzle-reviews")
export class PuzzleReviewController {
  private readonly logger = new Logger(PuzzleReviewController.name)

  constructor(private readonly reviewService: PuzzleReviewService) {}

  @Post()
  @ApiOperation({
    summary: "Submit puzzle review",
    description: "Submit a rating and optional review for a puzzle",
  })
  @ApiBody({
    schema: {
      type: "object",
      required: ["puzzleId", "rating"],
      properties: {
        puzzleId: { type: "string", format: "uuid" },
        userId: { type: "string", format: "uuid", description: "Optional for anonymous reviews" },
        username: { type: "string", description: "Display name for the review" },
        rating: { type: "number", minimum: 1, maximum: 5 },
        reviewText: { type: "string", maxLength: 2000 },
        reviewType: { type: "string", enum: Object.values(ReviewType) },
        isAnonymous: { type: "boolean", default: false },
        tags: { type: "array", items: { type: "string" } },
        metadata: {
          type: "object",
          properties: {
            difficulty: { type: "string" },
            completionTime: { type: "number" },
            deviceInfo: { type: "string" },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Review submitted successfully",
  })
  async createReview(reviewData: CreateReviewDto): Promise<{
    success: boolean
    message: string
    data: ReviewResponse
  }> {
    const request: Request = {} as Request // Temporary workaround for @Req() decorator issue
    this.logger.log(`Creating review for puzzle: ${reviewData.puzzleId}`)

    const ipAddress = request.ip || request.connection.remoteAddress

    const review = await this.reviewService.createReview(reviewData, ipAddress)

    return {
      success: true,
      message: "Review submitted successfully",
      data: review,
    }
  }

  @Put(":id")
  @ApiOperation({
    summary: "Update review",
    description: "Update an existing review (only by the original author)",
  })
  @ApiParam({ name: "id", description: "Review ID" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        rating: { type: "number", minimum: 1, maximum: 5 },
        reviewText: { type: "string", maxLength: 2000 },
        tags: { type: "array", items: { type: "string" } },
        userId: { type: "string", format: "uuid", description: "Required for ownership verification" },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Review updated successfully",
  })
  async updateReview(
    @Param("id", ParseUUIDPipe) id: string,
    updateData: UpdateReviewDto & { userId?: string },
  ): Promise<{
    success: boolean
    message: string
    data: ReviewResponse
  }> {
    this.logger.log(`Updating review: ${id}`)

    const review = await this.reviewService.updateReview(id, updateData, updateData.userId)

    return {
      success: true,
      message: "Review updated successfully",
      data: review,
    }
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete review",
    description: "Delete a review (only by the original author)",
  })
  @ApiParam({ name: "id", description: "Review ID" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        userId: { type: "string", format: "uuid", description: "Required for ownership verification" },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Review deleted successfully",
  })
  async deleteReview(
    @Param("id", ParseUUIDPipe) id: string,
    body: { userId?: string },
  ): Promise<{
    success: boolean
    message: string
  }> {
    this.logger.log(`Deleting review: ${id}`)

    await this.reviewService.deleteReview(id, body.userId)

    return {
      success: true,
      message: "Review deleted successfully",
    }
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get review",
    description: "Retrieve a specific review by ID",
  })
  @ApiParam({ name: "id", description: "Review ID" })
  @ApiResponse({
    status: 200,
    description: "Review retrieved successfully",
  })
  async getReview(@Param("id", ParseUUIDPipe) id: string): Promise<{
    success: boolean
    message: string
    data: ReviewResponse
  }> {
    this.logger.log(`Getting review: ${id}`)

    const review = await this.reviewService.getReview(id)

    return {
      success: true,
      message: "Review retrieved successfully",
      data: review,
    }
  }

  @Get()
  @ApiOperation({
    summary: "Get reviews",
    description: "Retrieve reviews with filtering and pagination",
  })
  @ApiQuery({ name: "page", required: false, type: Number, description: "Page number (default: 1)" })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Items per page (default: 20)" })
  @ApiQuery({ name: "puzzleId", required: false, type: String, description: "Filter by puzzle ID" })
  @ApiQuery({ name: "userId", required: false, type: String, description: "Filter by user ID" })
  @ApiQuery({ name: "status", required: false, enum: ReviewStatus, description: "Filter by status" })
  @ApiQuery({ name: "rating", required: false, type: Number, description: "Filter by rating" })
  @ApiQuery({ name: "minRating", required: false, type: Number, description: "Minimum rating filter" })
  @ApiQuery({ name: "maxRating", required: false, type: Number, description: "Maximum rating filter" })
  @ApiQuery({ name: "reviewType", required: false, enum: ReviewType, description: "Filter by review type" })
  @ApiQuery({
    name: "sortBy",
    required: false,
    enum: ["createdAt", "rating", "helpfulCount"],
    description: "Sort by field",
  })
  @ApiQuery({ name: "sortOrder", required: false, enum: ["ASC", "DESC"], description: "Sort order" })
  @ApiResponse({
    status: 200,
    description: "Reviews retrieved successfully",
  })
  async getReviews(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query("puzzleId") puzzleId?: string,
    @Query("userId") userId?: string,
    @Query("status") status?: ReviewStatus,
    @Query("rating", new DefaultValuePipe(0), ParseIntPipe) rating?: number,
    @Query("minRating", new DefaultValuePipe(0), ParseIntPipe) minRating?: number,
    @Query("maxRating", new DefaultValuePipe(0), ParseIntPipe) maxRating?: number,
    @Query("reviewType") reviewType?: ReviewType,
    @Query("sortBy") sortBy?: "createdAt" | "rating" | "helpfulCount",
    @Query("sortOrder") sortOrder?: "ASC" | "DESC",
  ) {
    this.logger.log(`Getting reviews - Page: ${page}, Limit: ${limit}`)

    const filters: ReviewFilters = {}
    if (puzzleId) filters.puzzleId = puzzleId
    if (userId) filters.userId = userId
    if (status) filters.status = status
    if (rating && rating > 0) filters.rating = rating
    if (minRating && minRating > 0) filters.minRating = minRating
    if (maxRating && maxRating > 0) filters.maxRating = maxRating
    if (reviewType) filters.reviewType = reviewType
    if (sortBy) filters.sortBy = sortBy
    if (sortOrder) filters.sortOrder = sortOrder

    const result = await this.reviewService.getReviews(filters, page, limit)

    return {
      success: true,
      message: "Reviews retrieved successfully",
      data: result,
    }
  }

  @Get("puzzle/:puzzleId/summary")
  @ApiOperation({
    summary: "Get puzzle review summary",
    description: "Get comprehensive review summary for a specific puzzle",
  })
  @ApiParam({ name: "puzzleId", description: "Puzzle ID" })
  @ApiResponse({
    status: 200,
    description: "Puzzle review summary retrieved successfully",
  })
  async getPuzzleReviewSummary(@Param("puzzleId", ParseUUIDPipe) puzzleId: string): Promise<{
    success: boolean
    message: string
    data: PuzzleReviewSummary
  }> {
    this.logger.log(`Getting review summary for puzzle: ${puzzleId}`)

    const summary = await this.reviewService.getPuzzleReviewSummary(puzzleId)

    return {
      success: true,
      message: "Puzzle review summary retrieved successfully",
      data: summary,
    }
  }

  @Get("stats/overview")
  @ApiOperation({
    summary: "Get review statistics",
    description: "Retrieve comprehensive review statistics",
  })
  @ApiResponse({
    status: 200,
    description: "Review statistics retrieved successfully",
  })
  async getReviewStats(): Promise<{
    success: boolean
    message: string
    data: ReviewStats
  }> {
    this.logger.log("Getting review statistics")

    const stats = await this.reviewService.getReviewStats()

    return {
      success: true,
      message: "Review statistics retrieved successfully",
      data: stats,
    }
  }

  @Post(":id/helpful")
  @ApiOperation({
    summary: "Mark review as helpful",
    description: "Mark a review as helpful (increases helpful count)",
  })
  @ApiParam({ name: "id", description: "Review ID" })
  @ApiResponse({
    status: 200,
    description: "Review marked as helpful",
  })
  async markReviewHelpful(@Param("id", ParseUUIDPipe) id: string): Promise<{
    success: boolean
    message: string
    data: ReviewResponse
  }> {
    this.logger.log(`Marking review as helpful: ${id}`)

    const review = await this.reviewService.markReviewHelpful(id)

    return {
      success: true,
      message: "Review marked as helpful",
      data: review,
    }
  }

  @Post(":id/report")
  @ApiOperation({
    summary: "Report review",
    description: "Report a review for inappropriate content",
  })
  @ApiParam({ name: "id", description: "Review ID" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        reason: { type: "string", description: "Reason for reporting" },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Review reported successfully",
  })
  async reportReview(
    @Param("id", ParseUUIDPipe) id: string,
    body: { reason?: string },
  ): Promise<{
    success: boolean
    message: string
    data: ReviewResponse
  }> {
    this.logger.log(`Reporting review: ${id}`)

    const review = await this.reviewService.reportReview(id, body.reason)

    return {
      success: true,
      message: "Review reported successfully",
      data: review,
    }
  }
}
