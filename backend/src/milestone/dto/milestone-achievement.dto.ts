import type { MilestoneCategory, MilestoneType } from "../entities/milestone-template.entity"

export class MilestoneAchievementDto {
  id: string
  title: string
  description: string
  category: MilestoneCategory
  milestoneType: MilestoneType
  points: number
  badgeIcon?: string
  badgeColor?: string
  achievedAt: Date
  achievedValue?: number
  isViewed: boolean
}

export class UserMilestoneStatsDto {
  totalMilestones: number
  totalPoints: number
  milestonesByCategory: Record<MilestoneCategory, number>
  recentAchievements: MilestoneAchievementDto[]
  nextMilestones: NextMilestoneDto[]
}

export class NextMilestoneDto {
  id: string
  title: string
  description: string
  category: MilestoneCategory
  requiredCount?: number
  currentProgress: number
  progressPercentage: number
  pointsReward: number
}

export class ProgressUpdateDto {
  category: MilestoneCategory
  progressKey: string
  incrementValue?: number
  newValue?: number
  metadata?: any
}
