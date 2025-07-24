import type { TargetType } from "../entities/feedback.entity"

export interface CreateFeedbackDto {
  rating: number
  comment?: string
  targetType: TargetType
  targetId?: string
  isAnonymous?: boolean
  metadata?: {
    userAgent?: string
    deviceInfo?: string
    appVersion?: string
    [key: string]: any
  }
}

export interface FeedbackResponse {
  id: string
  rating: number
  comment?: string
  targetType: TargetType
  targetId?: string
  isAnonymous: boolean
  userId?: string
  metadata?: any
  isResolved: boolean
  adminNotes?: string
  createdAt: Date
  updatedAt: Date
}

export interface FeedbackStats {
  totalFeedback: number
  averageRating: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
  feedbackByType: {
    [key in TargetType]: number
  }
  anonymousFeedback: number
  resolvedFeedback: number
  recentFeedback: number // last 7 days
}

export interface FeedbackFilters {
  targetType?: TargetType
  rating?: number
  isAnonymous?: boolean
  isResolved?: boolean
  startDate?: Date
  endDate?: Date
  userId?: string
  targetId?: string
}

export interface UpdateFeedbackDto {
  isResolved?: boolean
  adminNotes?: string
}
