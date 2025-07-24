import { Injectable } from "@nestjs/common"
import type { MilestoneAssignmentService } from "./milestone-assignment.service"
import type { UserProgressService } from "./user-progress.service"
import type { MilestoneTemplateService } from "./milestone-template.service"
import type { MilestoneAchievementDto, UserMilestoneStatsDto, NextMilestoneDto } from "../dto/milestone-achievement.dto"
import { MilestoneCategory } from "../entities/milestone-template.entity"

@Injectable()
export class MilestoneService {
  constructor(
    private readonly assignmentService: MilestoneAssignmentService,
    private readonly progressService: UserProgressService,
    private readonly templateService: MilestoneTemplateService,
  ) {}

  async getUserMilestones(userId: string): Promise<MilestoneAchievementDto[]> {
    const milestones = await this.assignmentService.getUserMilestones(userId)

    return milestones.map((milestone) => ({
      id: milestone.id,
      title: milestone.milestoneTemplate.title,
      description: milestone.milestoneTemplate.description,
      category: milestone.milestoneTemplate.category,
      milestoneType: milestone.milestoneTemplate.milestoneType,
      points: milestone.milestoneTemplate.points,
      badgeIcon: milestone.milestoneTemplate.badgeIcon,
      badgeColor: milestone.milestoneTemplate.badgeColor,
      achievedAt: milestone.achievedAt,
      achievedValue: milestone.achievedValue,
      isViewed: milestone.isViewed,
    }))
  }

  async getUserMilestoneStats(userId: string): Promise<UserMilestoneStatsDto> {
    const milestones = await this.assignmentService.getUserMilestones(userId)
    const nextMilestones = await this.getNextMilestones(userId)

    const totalMilestones = milestones.length
    const totalPoints = milestones.reduce((sum, m) => sum + m.milestoneTemplate.points, 0)

    const milestonesByCategory = milestones.reduce(
      (acc, milestone) => {
        acc[milestone.milestoneTemplate.category] = (acc[milestone.milestoneTemplate.category] || 0) + 1
        return acc
      },
      {} as Record<MilestoneCategory, number>,
    )

    // Fill in missing categories with 0
    Object.values(MilestoneCategory).forEach((category) => {
      if (!milestonesByCategory[category]) {
        milestonesByCategory[category] = 0
      }
    })

    const recentAchievements = milestones.slice(0, 5).map((milestone) => ({
      id: milestone.id,
      title: milestone.milestoneTemplate.title,
      description: milestone.milestoneTemplate.description,
      category: milestone.milestoneTemplate.category,
      milestoneType: milestone.milestoneTemplate.milestoneType,
      points: milestone.milestoneTemplate.points,
      badgeIcon: milestone.milestoneTemplate.badgeIcon,
      badgeColor: milestone.milestoneTemplate.badgeColor,
      achievedAt: milestone.achievedAt,
      achievedValue: milestone.achievedValue,
      isViewed: milestone.isViewed,
    }))

    return {
      totalMilestones,
      totalPoints,
      milestonesByCategory,
      recentAchievements,
      nextMilestones,
    }
  }

  async getNextMilestones(userId: string, limit = 5): Promise<NextMilestoneDto[]> {
    const templates = await this.templateService.getActiveTemplates()
    const userProgress = await this.progressService.getUserProgress(userId)
    const achievedMilestones = await this.assignmentService.getUserMilestones(userId)
    const achievedTemplateIds = new Set(achievedMilestones.map((m) => m.milestoneTemplateId))

    const nextMilestones: NextMilestoneDto[] = []

    for (const template of templates) {
      if (achievedTemplateIds.has(template.id) || template.isHidden) continue

      let currentProgress = 0
      let progressPercentage = 0

      if (template.requiredCount) {
        const progressKey = this.getProgressKeyForCategory(template.category)
        const progress = userProgress.find((p) => p.category === template.category && p.progressKey === progressKey)
        currentProgress = progress?.currentValue || 0
        progressPercentage = Math.min((currentProgress / template.requiredCount) * 100, 100)
      } else if (template.requiredStreak) {
        const streakProgress = userProgress.find(
          (p) => p.category === MilestoneCategory.STREAK && p.progressKey === "current_streak",
        )
        currentProgress = streakProgress?.currentValue || 0
        progressPercentage = Math.min((currentProgress / template.requiredStreak) * 100, 100)
      }

      if (progressPercentage < 100) {
        nextMilestones.push({
          id: template.id,
          title: template.title,
          description: template.description,
          category: template.category,
          requiredCount: template.requiredCount,
          currentProgress,
          progressPercentage,
          pointsReward: template.points,
        })
      }
    }

    return nextMilestones.sort((a, b) => b.progressPercentage - a.progressPercentage).slice(0, limit)
  }

  private getProgressKeyForCategory(category: MilestoneCategory): string {
    switch (category) {
      case MilestoneCategory.PUZZLE:
        return "puzzles_completed"
      case MilestoneCategory.SOCIAL:
        return "social_interactions"
      case MilestoneCategory.ENGAGEMENT:
        return "engagement_actions"
      default:
        return "general_progress"
    }
  }

  async markMilestoneAsViewed(userId: string, milestoneId: string): Promise<void> {
    await this.assignmentService.markMilestoneAsViewed(userId, milestoneId)
  }

  // Public methods for triggering milestone checks
  async onPuzzleCompleted(userId: string, puzzleData?: any): Promise<MilestoneAchievementDto[]> {
    const newMilestones = await this.assignmentService.onPuzzleCompleted(userId, puzzleData)
    return this.convertToAchievementDtos(newMilestones)
  }

  async onStreakUpdated(
    userId: string,
    currentStreak: number,
    longestStreak: number,
  ): Promise<MilestoneAchievementDto[]> {
    const newMilestones = await this.assignmentService.onStreakUpdated(userId, currentStreak, longestStreak)
    return this.convertToAchievementDtos(newMilestones)
  }

  async onCustomEvent(
    userId: string,
    category: MilestoneCategory,
    eventType: string,
    eventData?: any,
  ): Promise<MilestoneAchievementDto[]> {
    const newMilestones = await this.assignmentService.onCustomEvent(userId, category, eventType, eventData)
    return this.convertToAchievementDtos(newMilestones)
  }

  private convertToAchievementDtos(milestones: any[]): MilestoneAchievementDto[] {
    return milestones.map((milestone) => ({
      id: milestone.id,
      title: milestone.milestoneTemplate.title,
      description: milestone.milestoneTemplate.description,
      category: milestone.milestoneTemplate.category,
      milestoneType: milestone.milestoneTemplate.milestoneType,
      points: milestone.milestoneTemplate.points,
      badgeIcon: milestone.milestoneTemplate.badgeIcon,
      badgeColor: milestone.milestoneTemplate.badgeColor,
      achievedAt: milestone.achievedAt,
      achievedValue: milestone.achievedValue,
      isViewed: milestone.isViewed,
    }))
  }
}
