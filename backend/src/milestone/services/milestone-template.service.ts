import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import { type MilestoneTemplate, MilestoneCategory, MilestoneType } from "../entities/milestone-template.entity"

@Injectable()
export class MilestoneTemplateService {
  constructor(private readonly templateRepository: Repository<MilestoneTemplate>) {}

  async createTemplate(templateData: Partial<MilestoneTemplate>): Promise<MilestoneTemplate> {
    const template = this.templateRepository.create(templateData)
    return this.templateRepository.save(template)
  }

  async getActiveTemplates(): Promise<MilestoneTemplate[]> {
    return this.templateRepository.find({
      where: { isActive: true },
      order: { category: "ASC", sortOrder: "ASC" },
    })
  }

  async getTemplatesByCategory(category: MilestoneCategory): Promise<MilestoneTemplate[]> {
    return this.templateRepository.find({
      where: { category, isActive: true },
      order: { sortOrder: "ASC" },
    })
  }

  async initializeDefaultTemplates(): Promise<void> {
    const existingCount = await this.templateRepository.count()
    if (existingCount > 0) {
      return // Templates already exist
    }

    const defaultTemplates: Partial<MilestoneTemplate>[] = [
      // Puzzle Milestones
      {
        title: "First Steps",
        description: "Complete your first puzzle",
        category: MilestoneCategory.PUZZLE,
        milestoneType: MilestoneType.COUNT_BASED,
        requiredCount: 1,
        points: 10,
        badgeIcon: "trophy",
        badgeColor: "bronze",
        sortOrder: 1,
      },
      {
        title: "Getting Started",
        description: "Complete 5 puzzles",
        category: MilestoneCategory.PUZZLE,
        milestoneType: MilestoneType.COUNT_BASED,
        requiredCount: 5,
        points: 25,
        badgeIcon: "star",
        badgeColor: "bronze",
        sortOrder: 2,
      },
      {
        title: "Puzzle Enthusiast",
        description: "Complete 10 puzzles",
        category: MilestoneCategory.PUZZLE,
        milestoneType: MilestoneType.COUNT_BASED,
        requiredCount: 10,
        points: 50,
        badgeIcon: "medal",
        badgeColor: "silver",
        sortOrder: 3,
      },
      {
        title: "Puzzle Master",
        description: "Complete 25 puzzles",
        category: MilestoneCategory.PUZZLE,
        milestoneType: MilestoneType.COUNT_BASED,
        requiredCount: 25,
        points: 100,
        badgeIcon: "crown",
        badgeColor: "gold",
        sortOrder: 4,
      },
      {
        title: "Puzzle Legend",
        description: "Complete 50 puzzles",
        category: MilestoneCategory.PUZZLE,
        milestoneType: MilestoneType.COUNT_BASED,
        requiredCount: 50,
        points: 200,
        badgeIcon: "diamond",
        badgeColor: "platinum",
        sortOrder: 5,
      },
      {
        title: "Century Club",
        description: "Complete 100 puzzles",
        category: MilestoneCategory.PUZZLE,
        milestoneType: MilestoneType.COUNT_BASED,
        requiredCount: 100,
        points: 500,
        badgeIcon: "gem",
        badgeColor: "rainbow",
        sortOrder: 6,
      },
      // Streak Milestones
      {
        title: "Consistent Player",
        description: "Maintain a 3-day streak",
        category: MilestoneCategory.STREAK,
        milestoneType: MilestoneType.STREAK_BASED,
        requiredStreak: 3,
        points: 30,
        badgeIcon: "fire",
        badgeColor: "orange",
        sortOrder: 1,
      },
      {
        title: "Dedicated Solver",
        description: "Maintain a 7-day streak",
        category: MilestoneCategory.STREAK,
        milestoneType: MilestoneType.STREAK_BASED,
        requiredStreak: 7,
        points: 75,
        badgeIcon: "flame",
        badgeColor: "red",
        sortOrder: 2,
      },
      {
        title: "Streak Champion",
        description: "Maintain a 30-day streak",
        category: MilestoneCategory.STREAK,
        milestoneType: MilestoneType.STREAK_BASED,
        requiredStreak: 30,
        points: 300,
        badgeIcon: "lightning",
        badgeColor: "gold",
        sortOrder: 3,
      },
      // Engagement Milestones
      {
        title: "Early Bird",
        description: "Complete a puzzle before 8 AM",
        category: MilestoneCategory.ENGAGEMENT,
        milestoneType: MilestoneType.CUSTOM,
        customCriteria: JSON.stringify({ timeCondition: "before_8am" }),
        points: 20,
        badgeIcon: "sunrise",
        badgeColor: "yellow",
        sortOrder: 1,
      },
      {
        title: "Night Owl",
        description: "Complete a puzzle after 10 PM",
        category: MilestoneCategory.ENGAGEMENT,
        milestoneType: MilestoneType.CUSTOM,
        customCriteria: JSON.stringify({ timeCondition: "after_10pm" }),
        points: 20,
        badgeIcon: "moon",
        badgeColor: "purple",
        sortOrder: 2,
      },
      // Special Milestones
      {
        title: "Speed Demon",
        description: "Complete a puzzle in under 30 seconds",
        category: MilestoneCategory.SPECIAL,
        milestoneType: MilestoneType.CUSTOM,
        customCriteria: JSON.stringify({ completionTime: "under_30_seconds" }),
        points: 50,
        badgeIcon: "zap",
        badgeColor: "electric",
        sortOrder: 1,
        isHidden: true, // Surprise achievement
      },
    ]

    for (const templateData of defaultTemplates) {
      await this.createTemplate(templateData)
    }
  }

  async getTemplate(id: string): Promise<MilestoneTemplate | null> {
    return this.templateRepository.findOne({ where: { id } })
  }

  async updateTemplate(id: string, updateData: Partial<MilestoneTemplate>): Promise<MilestoneTemplate> {
    await this.templateRepository.update(id, updateData)
    return this.templateRepository.findOne({ where: { id } })
  }

  async deactivateTemplate(id: string): Promise<void> {
    await this.templateRepository.update(id, { isActive: false })
  }
}
