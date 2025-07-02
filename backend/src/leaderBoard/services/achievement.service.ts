import { Injectable, Logger } from "@nestjs/common"
import type { Repository } from "typeorm"
import { type Achievement, AchievementType } from "../entities/achievement.entity"
import type { UserAchievement } from "../entities/user-achievement.entity"
import type { LeaderboardEntry } from "../entities/leaderboard-entry.entity"
import type { UserBadgesResponseDto, UserAchievementDto } from "../dto/achievement-response.dto"

@Injectable()
export class AchievementService {
  private readonly logger = new Logger(AchievementService.name)

  constructor(
    private achievementRepository: Repository<Achievement>,
    private userAchievementRepository: Repository<UserAchievement>,
    private leaderboardRepository: Repository<LeaderboardEntry>,
  ) {}

  async initializeAchievements(): Promise<void> {
    const achievements = [
      {
        name: "First Steps",
        description: "Solve your first puzzle",
        iconUrl: "/icons/first-puzzle.png",
        type: AchievementType.FIRST_PUZZLE_SOLVED,
        requiredValue: 1,
      },
      {
        name: "Global Elite",
        description: "Reach top 10 in global leaderboard",
        iconUrl: "/icons/global-top10.png",
        type: AchievementType.TOP_10_GLOBAL,
        requiredValue: 10,
      },
      {
        name: "Country Champion",
        description: "Reach top 10 in your country",
        iconUrl: "/icons/country-top10.png",
        type: AchievementType.TOP_10_COUNTRY,
        requiredValue: 10,
      },
      {
        name: "Week Warrior",
        description: "Maintain a 7-day streak",
        iconUrl: "/icons/streak-7.png",
        type: AchievementType.DAILY_STREAK_7,
        requiredValue: 7,
      },
      {
        name: "Month Master",
        description: "Maintain a 30-day streak",
        iconUrl: "/icons/streak-30.png",
        type: AchievementType.DAILY_STREAK_30,
        requiredValue: 30,
      },
      {
        name: "Rising Star",
        description: "Reach 1,000 points",
        iconUrl: "/icons/score-1k.png",
        type: AchievementType.SCORE_MILESTONE_1000,
        requiredValue: 1000,
      },
      {
        name: "High Achiever",
        description: "Reach 5,000 points",
        iconUrl: "/icons/score-5k.png",
        type: AchievementType.SCORE_MILESTONE_5000,
        requiredValue: 5000,
      },
      {
        name: "Legend",
        description: "Reach 10,000 points",
        iconUrl: "/icons/score-10k.png",
        type: AchievementType.SCORE_MILESTONE_10000,
        requiredValue: 10000,
      },
      {
        name: "Puzzle Enthusiast",
        description: "Complete 10 puzzles",
        iconUrl: "/icons/puzzles-10.png",
        type: AchievementType.PUZZLES_COMPLETED_10,
        requiredValue: 10,
      },
      {
        name: "Puzzle Expert",
        description: "Complete 50 puzzles",
        iconUrl: "/icons/puzzles-50.png",
        type: AchievementType.PUZZLES_COMPLETED_50,
        requiredValue: 50,
      },
      {
        name: "Puzzle Master",
        description: "Complete 100 puzzles",
        iconUrl: "/icons/puzzles-100.png",
        type: AchievementType.PUZZLES_COMPLETED_100,
        requiredValue: 100,
      },
    ]

    for (const achievementData of achievements) {
      const existing = await this.achievementRepository.findOne({
        where: { type: achievementData.type },
      })

      if (!existing) {
        const achievement = this.achievementRepository.create(achievementData)
        await this.achievementRepository.save(achievement)
        this.logger.log(`Created achievement: ${achievementData.name}`)
      }
    }
  }

  async checkAndAwardAchievements(userId: string): Promise<UserAchievement[]> {
    const leaderboardEntry = await this.leaderboardRepository.findOne({
      where: { userId },
    })

    if (!leaderboardEntry) return []

    const newAchievements: UserAchievement[] = []

    // Check score milestones
    await this.checkScoreMilestones(userId, leaderboardEntry.score, newAchievements)

    // Check puzzle completion milestones
    await this.checkPuzzleMilestones(userId, leaderboardEntry.puzzlesCompleted, newAchievements)

    // Check streak achievements
    await this.checkStreakAchievements(userId, leaderboardEntry.maxDailyStreak, newAchievements)

    // Check ranking achievements
    await this.checkRankingAchievements(userId, leaderboardEntry, newAchievements)

    return newAchievements
  }

  private async checkScoreMilestones(userId: string, score: number, newAchievements: UserAchievement[]): Promise<void> {
    const scoreMilestones = [
      AchievementType.SCORE_MILESTONE_1000,
      AchievementType.SCORE_MILESTONE_5000,
      AchievementType.SCORE_MILESTONE_10000,
    ]

    for (const milestoneType of scoreMilestones) {
      const achievement = await this.achievementRepository.findOne({
        where: { type: milestoneType },
      })

      if (achievement && score >= achievement.requiredValue) {
        const awarded = await this.awardAchievement(userId, achievement.id, score)
        if (awarded) newAchievements.push(awarded)
      }
    }
  }

  private async checkPuzzleMilestones(
    userId: string,
    puzzlesCompleted: number,
    newAchievements: UserAchievement[],
  ): Promise<void> {
    const puzzleMilestones = [
      AchievementType.FIRST_PUZZLE_SOLVED,
      AchievementType.PUZZLES_COMPLETED_10,
      AchievementType.PUZZLES_COMPLETED_50,
      AchievementType.PUZZLES_COMPLETED_100,
    ]

    for (const milestoneType of puzzleMilestones) {
      const achievement = await this.achievementRepository.findOne({
        where: { type: milestoneType },
      })

      if (achievement && puzzlesCompleted >= achievement.requiredValue) {
        const awarded = await this.awardAchievement(userId, achievement.id, puzzlesCompleted)
        if (awarded) newAchievements.push(awarded)
      }
    }
  }

  private async checkStreakAchievements(
    userId: string,
    maxStreak: number,
    newAchievements: UserAchievement[],
  ): Promise<void> {
    const streakMilestones = [AchievementType.DAILY_STREAK_7, AchievementType.DAILY_STREAK_30]

    for (const milestoneType of streakMilestones) {
      const achievement = await this.achievementRepository.findOne({
        where: { type: milestoneType },
      })

      if (achievement && maxStreak >= achievement.requiredValue) {
        const awarded = await this.awardAchievement(userId, achievement.id, maxStreak)
        if (awarded) newAchievements.push(awarded)
      }
    }
  }

  private async checkRankingAchievements(
    userId: string,
    entry: LeaderboardEntry,
    newAchievements: UserAchievement[],
  ): Promise<void> {
    // Check global top 10
    if (entry.globalRank && entry.globalRank <= 10) {
      const achievement = await this.achievementRepository.findOne({
        where: { type: AchievementType.TOP_10_GLOBAL },
      })
      if (achievement) {
        const awarded = await this.awardAchievement(userId, achievement.id, entry.globalRank)
        if (awarded) newAchievements.push(awarded)
      }
    }

    // Check country top 10
    if (entry.countryRank && entry.countryRank <= 10) {
      const achievement = await this.achievementRepository.findOne({
        where: { type: AchievementType.TOP_10_COUNTRY },
      })
      if (achievement) {
        const awarded = await this.awardAchievement(userId, achievement.id, entry.countryRank)
        if (awarded) newAchievements.push(awarded)
      }
    }
  }

  private async awardAchievement(
    userId: string,
    achievementId: string,
    progressValue: number,
  ): Promise<UserAchievement | null> {
    // Check if user already has this achievement
    const existing = await this.userAchievementRepository.findOne({
      where: { userId, achievementId },
    })

    if (existing) return null

    const userAchievement = this.userAchievementRepository.create({
      userId,
      achievementId,
      earnedAt: new Date(),
      progressValue,
    })

    const saved = await this.userAchievementRepository.save(userAchievement)
    this.logger.log(`Awarded achievement ${achievementId} to user ${userId}`)

    return saved
  }

  async getUserBadges(userId: string): Promise<UserBadgesResponseDto> {
    const userAchievements = await this.userAchievementRepository.find({
      where: { userId },
      relations: ["achievement"],
      order: { earnedAt: "DESC" },
    })

    const badges: UserAchievementDto[] = userAchievements.map((ua) => ({
      id: ua.achievement.id,
      name: ua.achievement.name,
      description: ua.achievement.description,
      iconUrl: ua.achievement.iconUrl,
      type: ua.achievement.type,
      requiredValue: ua.achievement.requiredValue,
      earnedAt: ua.earnedAt,
      progressValue: ua.progressValue,
    }))

    return {
      badges,
      totalBadges: badges.length,
    }
  }

  async getAllAchievements() {
    return this.achievementRepository.find({
      where: { active: true },
      order: { requiredValue: "ASC" },
    })
  }
}
