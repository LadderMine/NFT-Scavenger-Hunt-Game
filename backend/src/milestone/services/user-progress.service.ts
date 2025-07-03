import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { UserProgress } from "../entities/user-progress.entity"
import { MilestoneCategory } from "../entities/milestone-template.entity"
import type { ProgressUpdateDto } from "../dto/milestone-achievement.dto"

@Injectable()
export class UserProgressService {
  constructor(private readonly progressRepository: Repository<UserProgress>) {}

  async updateProgress(userId: string, updateDto: ProgressUpdateDto): Promise<UserProgress> {
    let progress = await this.progressRepository.findOne({
      where: {
        userId,
        category: updateDto.category,
        progressKey: updateDto.progressKey,
      },
    })

    if (!progress) {
      progress = this.progressRepository.create({
        userId,
        category: updateDto.category,
        progressKey: updateDto.progressKey,
        currentValue: 0,
        totalValue: 0,
      })
    }

    // Update values
    if (updateDto.newValue !== undefined) {
      progress.currentValue = updateDto.newValue
      progress.totalValue = Math.max(progress.totalValue, updateDto.newValue)
    } else if (updateDto.incrementValue !== undefined) {
      progress.currentValue += updateDto.incrementValue
      progress.totalValue += updateDto.incrementValue
    }

    progress.lastUpdated = new Date()
    progress.metadata = updateDto.metadata ? JSON.stringify(updateDto.metadata) : progress.metadata

    return this.progressRepository.save(progress)
  }

  async getProgress(userId: string, category: MilestoneCategory, progressKey: string): Promise<UserProgress | null> {
    return this.progressRepository.findOne({
      where: { userId, category, progressKey },
    })
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return this.progressRepository.find({
      where: { userId },
      order: { category: "ASC", progressKey: "ASC" },
    })
  }

  async getProgressByCategory(userId: string, category: MilestoneCategory): Promise<UserProgress[]> {
    return this.progressRepository.find({
      where: { userId, category },
      order: { progressKey: "ASC" },
    })
  }

  // Convenience methods for common progress updates
  async incrementPuzzleCount(userId: string, metadata?: any): Promise<UserProgress> {
    return this.updateProgress(userId, {
      category: MilestoneCategory.PUZZLE,
      progressKey: "puzzles_completed",
      incrementValue: 1,
      metadata,
    })
  }

  async updateCurrentStreak(userId: string, streakValue: number): Promise<UserProgress> {
    return this.updateProgress(userId, {
      category: MilestoneCategory.STREAK,
      progressKey: "current_streak",
      newValue: streakValue,
    })
  }

  async updateLongestStreak(userId: string, streakValue: number): Promise<UserProgress> {
    const currentLongest = await this.getProgress(userId, MilestoneCategory.STREAK, "longest_streak")
    if (!currentLongest || streakValue > currentLongest.currentValue) {
      return this.updateProgress(userId, {
        category: MilestoneCategory.STREAK,
        progressKey: "longest_streak",
        newValue: streakValue,
      })
    }
    return currentLongest
  }

  async recordCustomProgress(
    userId: string,
    category: MilestoneCategory,
    progressKey: string,
    value: number,
    metadata?: any,
  ): Promise<UserProgress> {
    return this.updateProgress(userId, {
      category,
      progressKey,
      newValue: value,
      metadata,
    })
  }
}
