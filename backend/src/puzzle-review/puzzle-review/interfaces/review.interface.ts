import type { ReviewStatus, ReviewType } from "../entities/puzzle-review.entity"
import type { ModerationAction, ModerationReason } from "../entities/review-moderation.entity"

export interface CreateReviewDto {
  puzzleId: string
  userId?: string
  username?: string
  rating: number
  reviewText?: string
  reviewType?: ReviewType
  isAnonymous?: boolean
  tags?: string[]
  metadata?: ReviewMetadata
}

export interface ReviewMetadata {
  ipAddress?: string
  userAgent?: string
  deviceInfo?: string
  difficulty?: string
  completionTime?: number
  [key: string]: any
}

export interface UpdateReviewDto {
  rating?: number
  reviewText?: string
  tags?: string[]
  metadata?: ReviewMetadata
}

export interface ReviewResponse {
  id: string
  puzzleId: string
  userId?: string
  username?: string
  rating: number
  reviewText?: string
  reviewType: ReviewType
  status: ReviewStatus
  isAnonymous: boolean
  isEdited: boolean
  editedAt?: Date
  tags?: string[]
  helpfulCount: number
  reportCount: number
  createdAt: Date
  updatedAt: Date
}

export interface ReviewFilters {
  puzzleId?: string
  userId?: string
  status?: ReviewStatus
  rating?: number
  minRating?: number
  maxRating?: number
  reviewType?: ReviewType
  isAnonymous?: boolean
  startDate?: Date
  endDate?: Date
  tags?: string[]
  sortBy?: "createdAt" | "rating" | "helpfulCount"
  sortOrder?: "ASC" | "DESC"
}

export interface PuzzleReviewSummary {
  puzzleId: string
  totalReviews: number
  averageRating: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
  reviewsByStatus: Record<ReviewStatus, number>
  recentReviews: number
  topTags: Array<{ tag: string; count: number }>
}

export interface ReviewStats {
  totalReviews: number
  averageRating: number
  reviewsByStatus: Record<ReviewStatus, number>
  reviewsByType: Record<ReviewType, number>
  anonymousReviews: number
  recentActivity: {
    last24Hours: number
    last7Days: number
    last30Days: number
  }
  moderationStats: {
    pendingReviews: number
    flaggedReviews: number
    totalModerations: number
  }
}

export interface ModerationRequest {
  reviewId: string
  action: ModerationAction
  reason?: ModerationReason
  notes?: string
  moderatorId: string
}

export interface ModerationResponse {
  success: boolean
  reviewId: string
  action: ModerationAction
  previousStatus: ReviewStatus
  newStatus: ReviewStatus
  moderationId: string
}

export interface ReviewValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  autoModerationFlags: string[]
}
