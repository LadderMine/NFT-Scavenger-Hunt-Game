import type { FraudActivityType } from "../entities/fraud-activity.entity"
import type { FraudReviewStatus } from "../entities/fraud-suspect.entity"

export interface FraudDetectionResult {
  isFraudulent: boolean
  riskScore?: number
  detectedIssues?: FraudActivityType[]
}

export interface FraudReviewResult {
  id: string
  status: FraudReviewStatus
  reviewedBy: string
  reviewedAt: Date
}

export interface FraudStats {
  totalSuspects: number
  pendingReview: number
  confirmedFraud: number
  dismissedCases: number
  activityByType: Record<FraudActivityType, number>
  detectionsByDay: Array<{ date: string; count: number }>
}

