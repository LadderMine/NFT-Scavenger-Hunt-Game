import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { UserMilestone } from "../entities/user-milestone.entity"
import { type MilestoneTemplate, MilestoneType, MilestoneCategory } from "../entities/milestone-template.entity"
import type { UserProgressService } from "./user-progress.service"
import type { MilestoneTemplateService } from "./milestone-template.service"

@Injectable()
export class MilestoneAssignmentService {
  constructor(
    private readonly userMilestoneRepository: Repository<UserMilestone>,
    private readonly progressService: UserProgressService,
    private readonly templateService: MilestoneTemplateService,
  ) {}

  async checkAndAssignMilestones(userId: string, category?: MilestoneCategory): Promise<UserMilestone[]> {
    const templates = category
      ? await this.templateService.getTemplatesByCategory(category)
      : await this.templateService.getActiveTemplates()

    const newAchievements: UserMilestone[] = []

    for (const template of templates) {
      const hasAchieved = await this.hasUserAchievedMilestone(userId, template.id)
      if (hasAchieved) continue

      const shouldAssign = await this.shouldAssignMilestone(userId, template)
      if (shouldAssign.eligible) {
        const milestone = await this.assignMilestone(userId, template, shouldAssign.achievedValue, shouldAssign.context)
        newAchievements.push(milestone)
      }
    }

    return newAchievements
  }

  private async shouldAssignMilestone(
    userId: string,
    template: MilestoneTemplate,
  ): Promise<{ eligible: boolean; achievedValue?: number; context?: any }> {
    switch (template.milestoneType) {
      case MilestoneType.COUNT_BASED:
        return this.checkCountBasedMilestone(userId, template)

      case MilestoneType.STREAK_BASED:
        return this.checkStreakBasedMilestone(userId, template)

      case MilestoneType.TIME_BASED:
        return this.checkTimeBasedMilestone(userId, template)

      case MilestoneType.PERCENTAGE_BASED:
        return this.checkPercentageBasedMilestone(userId, template)

      case MilestoneType.CUSTOM:
        return this.checkCustomMilestone(userId, template)

      default:
        return { eligible: false }
    }
  }

  private async checkCountBasedMilestone(
    userId: string,
    template: MilestoneTemplate,
  ): Promise<{ eligible: boolean; achievedValue?: number; context?: any }> {
    if (!template.requiredCount) return { eligible: false }

    let progressKey: string
    switch (template.category) {
      case MilestoneCategory.PUZZLE:
        progressKey = "puzzles_completed"
        break
      case MilestoneCategory.SOCIAL:
        progressKey = "social_interactions"
        break
      case MilestoneCategory.ENGAGEMENT:
        progressKey = "engagement_actions"
        break
      default:
        return { eligible: false }
    }

    const progress = await this.progressService.getProgress(userId, template.category, progressKey)
    if (!progress) return { eligible: false }

    return {
      eligible: progress.currentValue >= template.requiredCount,
      achievedValue: progress.currentValue,
      context: { progressKey, totalValue: progress.totalValue },
    }
  }

  private async checkStreakBasedMilestone(
    userId: string,
    template: MilestoneTemplate,
  ): Promise<{ eligible: boolean; achievedValue?: number; context?: any }> {
    if (!template.requiredStreak) return { eligible: false }

    const currentStreak = await this.progressService.getProgress(userId, MilestoneCategory.STREAK, "current_streak")
    const longestStreak = await this.progressService.getProgress(userId, MilestoneCategory.STREAK, "longest_streak")

    const maxStreak = Math.max(currentStreak?.currentValue || 0, longestStreak?.currentValue || 0)

    return {
      eligible: maxStreak >= template.requiredStreak,
      achievedValue: maxStreak,
      context: { currentStreak: currentStreak?.currentValue, longestStreak: longestStreak?.currentValue },
    }
  }

  private async checkTimeBasedMilestone(
    userId: string,
    template: MilestoneTemplate,
  ): Promise<{ eligible: boolean; achievedValue?: number; context?: any }> {
    // Implementation for time-based milestones
    // This could check for things like "active for 30 days"
    return { eligible: false } // Placeholder
  }

  private async checkPercentageBasedMilestone(
    userId: string,
    template: MilestoneTemplate,
  ): Promise<{ eligible: boolean; achievedValue?: number; context?: any }> {
    // Implementation for percentage-based milestones
    // This could check for things like "90% puzzle completion rate"
    return { eligible: false } // Placeholder
  }

  private async checkCustomMilestone(
    userId: string,
    template: MilestoneTemplate,
  ): Promise<{ eligible: boolean; achievedValue?: number; context?: any }> {
    if (!template.customCriteria) return { eligible: false }

    try {
      const criteria = JSON.parse(template.customCriteria)

      // Handle time-based custom milestones
      if (criteria.timeCondition) {
        return this.checkTimeCondition(userId, criteria.timeCondition)
      }

      // Handle completion time milestones
      if (criteria.completionTime) {
        return this.checkCompletionTime(userId, criteria.completionTime)
      }

      return { eligible: false }
    } catch (error) {
      console.error("Error parsing custom criteria:", error)
      return { eligible: false }
    }
  }

  private async checkTimeCondition(
    userId: string,
    condition: string,
  ): Promise<{ eligible: boolean; achievedValue?: number; context?: any }> {
    // This would need to be implemented based on your activity tracking
    // For now, returning false as placeholder
    return { eligible: false }
  }

  private async checkCompletionTime(
    userId: string,
    condition: string,
  ): Promise<{ eligible: boolean; achievedValue?: number; context?: any }> {
    // This would need to be implemented based on your puzzle completion tracking
    // For now, returning false as placeholder
    return { eligible: false }
  }

  private async assignMilestone(
    userId: string,
    template: MilestoneTemplate,
    achievedValue?: number,
    context?: any,
  ): Promise<UserMilestone> {
    const milestone = this.userMilestoneRepository.create({
      userId,
      milestoneTemplateId: template.id,
      achievedAt: new Date(),
      achievedValue,
      achievementContext: context ? JSON.stringify(context) : null,
    })

    return this.userMilestoneRepository.save(milestone)
  }

  private async hasUserAchievedMilestone(userId: string, templateId: string): Promise<boolean> {
    const existing = await this.userMilestoneRepository.findOne({
      where: { userId, milestoneTemplateId: templateId },
    })
    return !!existing
  }

  async getUserMilestones(userId: string): Promise<UserMilestone[]> {
    return this.userMilestoneRepository.find({
      where: { userId },
      relations: ["milestoneTemplate"],
      order: { achievedAt: "DESC" },
    })
  }

  async markMilestoneAsViewed(userId: string, milestoneId: string): Promise<void> {
    await this.userMilestoneRepository.update({ id: milestoneId, userId }, { isViewed: true })
  }

  async markMilestoneAsNotified(userId: string, milestoneId: string): Promise<void> {
    await this.userMilestoneRepository.update({ id: milestoneId, userId }, { isNotified: true })
  }

  // Method to be called when a user completes a puzzle
  async onPuzzleCompleted(userId: string, puzzleMetadata?: any): Promise<UserMilestone[]> {
    // Update progress
    await this.progressService.incrementPuzzleCount(userId, puzzleMetadata)

    // Check and assign puzzle-related milestones
    return this.checkAndAssignMilestones(userId, MilestoneCategory.PUZZLE)
  }

  // Method to be called when a user's streak changes
  async onStreakUpdated(userId: string, currentStreak: number, longestStreak: number): Promise<UserMilestone[]> {
    // Update progress
    await this.progressService.updateCurrentStreak(userId, currentStreak)
    await this.progressService.updateLongestStreak(userId, longestStreak)

    // Check and assign streak-related milestones
    return this.checkAndAssignMilestones(userId, MilestoneCategory.STREAK)
  }

  // Method for custom milestone triggers
  async onCustomEvent(
    userId: string,
    category: MilestoneCategory,
    eventType: string,
    eventData?: any,
  ): Promise<UserMilestone[]> {
    // Record custom progress
    await this.progressService.recordCustomProgress(userId, category, eventType, 1, eventData)

    // Check and assign related milestones
    return this.checkAndAssignMilestones(userId, category)
  }
}
