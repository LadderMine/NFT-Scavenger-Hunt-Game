import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
  Req,
  Logger,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth, ApiBody } from "@nestjs/swagger"
import type { Request } from "express"
import type { FeedbackService } from "../services/feedback.service"
import { AdminGuard } from "../guards/admin.guard"
import { TargetType } from "../entities/feedback.entity"
import type {
  CreateFeedbackDto,
  FeedbackResponse,
  FeedbackStats,
  FeedbackFilters,
  UpdateFeedbackDto,
} from "../interfaces/feedback.interface"

@ApiTags("Feedback")
@Controller("feedback")
export class FeedbackController {
  private readonly logger = new Logger(FeedbackController.name)

  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({
    summary: "Submit feedback",
    description: "Submit feedback for puzzles, app experience, or educational content. Can be anonymous.",
  })
  @ApiBody({
    schema: {
      type: "object",
      required: ["rating", "targetType"],
      properties: {
        rating: {
          type: "number",
          minimum: 1,
          maximum: 5,
          description: "Rating from 1 to 5",
        },
        comment: {
          type: "string",
          description: "Optional feedback comment",
        },
        targetType: {
          type: "string",
          enum: ["Puzzle", "App", "Education"],
          description: "Type of content being reviewed",
        },
        targetId: {
          type: "string",
          format: "uuid",
          description: "Optional ID of specific content being reviewed",
        },
        isAnonymous: {
          type: "boolean",
          default: false,
          description: "Whether to submit feedback anonymously",
        },
        metadata: {
          type: "object",
          description: "Optional metadata (device info, app version, etc.)",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Feedback submitted successfully",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "string" },
            rating: { type: "number" },
            targetType: { type: "string" },
            isAnonymous: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid input data",
  })
  async submitFeedback(
    feedbackData: CreateFeedbackDto,
    @Req() request: Request,
  ): Promise<{
    success: boolean
    message: string
    data: FeedbackResponse
  }> {
    this.logger.log(`Feedback submission: ${feedbackData.targetType} - Rating: ${feedbackData.rating}`)

    // Extract user info from request (if authenticated)
    const user = (request as any).user
    const userId = user?.id
    const ipAddress = request.ip || request.connection.remoteAddress

    const feedback = await this.feedbackService.createFeedback(feedbackData, userId, ipAddress)

    return {
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    }
  }

  @Get("admin")
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get all feedback (Admin only)",
    description: "Retrieve all feedback entries with filtering and pagination options",
  })
  @ApiQuery({ name: "page", required: false, type: Number, description: "Page number (default: 1)" })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Items per page (default: 50)" })
  @ApiQuery({ name: "targetType", required: false, enum: TargetType, description: "Filter by target type" })
  @ApiQuery({ name: "rating", required: false, type: Number, description: "Filter by rating (1-5)" })
  @ApiQuery({ name: "isAnonymous", required: false, type: Boolean, description: "Filter by anonymous status" })
  @ApiQuery({ name: "isResolved", required: false, type: Boolean, description: "Filter by resolution status" })
  @ApiQuery({ name: "userId", required: false, type: String, description: "Filter by user ID" })
  @ApiQuery({ name: "targetId", required: false, type: String, description: "Filter by target ID" })
  @ApiResponse({
    status: 200,
    description: "Feedback retrieved successfully",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Admin access required",
  })
  async getAllFeedback(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query("targetType") targetType?: TargetType,
    @Query("rating", new DefaultValuePipe(0), ParseIntPipe) rating?: number,
    @Query("isAnonymous") isAnonymous?: boolean,
    @Query("isResolved") isResolved?: boolean,
    @Query("userId") userId?: string,
    @Query("targetId") targetId?: string,
  ) {
    this.logger.log(`Admin fetching feedback - Page: ${page}, Limit: ${limit}`)

    const filters: FeedbackFilters = {}

    if (targetType) filters.targetType = targetType
    if (rating && rating > 0) filters.rating = rating
    if (isAnonymous !== undefined) filters.isAnonymous = isAnonymous
    if (isResolved !== undefined) filters.isResolved = isResolved
    if (userId) filters.userId = userId
    if (targetId) filters.targetId = targetId

    const result = await this.feedbackService.getAllFeedback(filters, page, limit)

    return {
      success: true,
      message: "Feedback retrieved successfully",
      data: result,
    }
  }

  @Get("stats")
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get feedback statistics (Admin only)",
    description: "Retrieve comprehensive feedback statistics and analytics",
  })
  @ApiResponse({
    status: 200,
    description: "Statistics retrieved successfully",
  })
  async getFeedbackStats(): Promise<{
    success: boolean
    message: string
    data: FeedbackStats
  }> {
    this.logger.log("Admin fetching feedback statistics")

    const stats = await this.feedbackService.getFeedbackStats()

    return {
      success: true,
      message: "Statistics retrieved successfully",
      data: stats,
    }
  }

  @Get("target/:targetType")
  @ApiOperation({
    summary: "Get feedback for specific target type",
    description: "Retrieve feedback for a specific target type (Puzzle, App, Education)",
  })
  @ApiParam({
    name: "targetType",
    enum: TargetType,
    description: "Type of target to get feedback for",
  })
  @ApiQuery({
    name: "targetId",
    required: false,
    type: String,
    description: "Optional specific target ID",
  })
  @ApiResponse({
    status: 200,
    description: "Target feedback retrieved successfully",
  })
  async getFeedbackByTarget(@Param("targetType") targetType: TargetType, @Query("targetId") targetId?: string) {
    this.logger.log(`Fetching feedback for ${targetType}${targetId ? ` - ${targetId}` : ""}`)

    const result = await this.feedbackService.getFeedbackByTarget(targetType, targetId)

    return {
      success: true,
      message: "Target feedback retrieved successfully",
      data: result,
    }
  }

  @Put("admin/:id")
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update feedback (Admin only)",
    description: "Update feedback resolution status and admin notes",
  })
  @ApiParam({
    name: "id",
    type: String,
    description: "Feedback ID",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        isResolved: {
          type: "boolean",
          description: "Mark feedback as resolved/unresolved",
        },
        adminNotes: {
          type: "string",
          description: "Admin notes about the feedback",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Feedback updated successfully",
  })
  async updateFeedback(
    @Param("id", ParseUUIDPipe) id: string,
    updateData: UpdateFeedbackDto,
  ): Promise<{
    success: boolean
    message: string
    data: FeedbackResponse
  }> {
    this.logger.log(`Admin updating feedback: ${id}`)

    const feedback = await this.feedbackService.updateFeedback(id, updateData)

    return {
      success: true,
      message: "Feedback updated successfully",
      data: feedback,
    }
  }

  @Delete("admin/:id")
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete feedback (Admin only)",
    description: "Permanently delete a feedback entry",
  })
  @ApiParam({
    name: "id",
    type: String,
    description: "Feedback ID",
  })
  @ApiResponse({
    status: 200,
    description: "Feedback deleted successfully",
  })
  async deleteFeedback(@Param("id", ParseUUIDPipe) id: string): Promise<{
    success: boolean
    message: string
  }> {
    this.logger.log(`Admin deleting feedback: ${id}`)

    await this.feedbackService.deleteFeedback(id)

    return {
      success: true,
      message: "Feedback deleted successfully",
    }
  }
}
