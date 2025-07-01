import { Injectable, Logger } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { LeaderboardEntry } from "../entities/leaderboard-entry.entity"
import type { LeaderboardQueryDto } from "../dto/leaderboard-query.dto"
import type { LeaderboardResponseDto, LeaderboardEntryDto } from "../dto/leaderboard-response.dto"

@Injectable()
export class LeaderboardService {
  private readonly logger = new Logger("LeaderboardService")

  constructor(private leaderboardRepository: Repository<LeaderboardEntry>) {}

  async getGlobalLeaderboard(query: LeaderboardQueryDto): Promise<LeaderboardResponseDto> {
    const { page = 1, limit = 50 } = query
    const offset = (page - 1) * limit

    const [entries, total] = await this.leaderboardRepository.findAndCount({
      order: { score: "DESC", puzzlesCompleted: "DESC" },
      take: limit,
      skip: offset,
    })

    const leaderboardEntries: LeaderboardEntryDto[] = entries.map((entry, index) => ({
      userId: entry.userId,
      username: entry.username,
      score: entry.score,
      puzzlesCompleted: entry.puzzlesCompleted,
      dailyStreak: entry.dailyStreak,
      rank: offset + index + 1,
      country: entry.country,
    }))

    return {
      entries: leaderboardEntries,
      total,
      page,
      limit,
    }
  }

  async getCountryLeaderboard(country: string, query: LeaderboardQueryDto): Promise<LeaderboardResponseDto> {
    const { page = 1, limit = 50 } = query
    const offset = (page - 1) * limit

    const [entries, total] = await this.leaderboardRepository.findAndCount({
      where: { country: country.toUpperCase() },
      order: { score: "DESC", puzzlesCompleted: "DESC" },
      take: limit,
      skip: offset,
    })

    const leaderboardEntries: LeaderboardEntryDto[] = entries.map((entry, index) => ({
      userId: entry.userId,
      username: entry.username,
      score: entry.score,
      puzzlesCompleted: entry.puzzlesCompleted,
      dailyStreak: entry.dailyStreak,
      rank: offset + index + 1,
      country: entry.country,
    }))

    return {
      entries: leaderboardEntries,
      total,
      page,
      limit,
      country: country.toUpperCase(),
    }
  }

  async updateUserScore(userId: string, username: string, scoreIncrement: number, country?: string): Promise<void> {
    let entry = await this.leaderboardRepository.findOne({ where: { userId } })

    if (!entry) {
      entry = this.leaderboardRepository.create({
        userId,
        username,
        score: scoreIncrement,
        puzzlesCompleted: 1,
        country: country?.toUpperCase(),
        lastActivityDate: new Date(),
      })
    } else {
      entry.score += scoreIncrement
      entry.puzzlesCompleted += 1
      entry.lastActivityDate = new Date()
      if (country && !entry.country) {
        entry.country = country.toUpperCase()
      }
    }

    await this.leaderboardRepository.save(entry)
    await this.updateRankings()
  }

  async updateDailyStreak(userId: string): Promise<void> {
    const entry = await this.leaderboardRepository.findOne({ where: { userId } })
    if (!entry) return

    const today = new Date()
    const lastActivity = entry.lastActivityDate

    if (lastActivity) {
      const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff === 1) {
        // Consecutive day
        entry.dailyStreak += 1
        entry.maxDailyStreak = Math.max(entry.maxDailyStreak, entry.dailyStreak)
      } else if (daysDiff > 1) {
        // Streak broken
        entry.dailyStreak = 1
      }
      // If daysDiff === 0, same day, no change needed
    } else {
      entry.dailyStreak = 1
      entry.maxDailyStreak = 1
    }

    entry.lastActivityDate = today
    await this.leaderboardRepository.save(entry)
  }

  private async updateRankings(): Promise<void> {
    // Update global rankings
    await this.leaderboardRepository.query(`
      UPDATE leaderboard_entries 
      SET global_rank = ranked.rank 
      FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY score DESC, puzzles_completed DESC) as rank 
        FROM leaderboard_entries
      ) ranked 
      WHERE leaderboard_entries.id = ranked.id
    `)

    // Update country rankings
    await this.leaderboardRepository.query(`
      UPDATE leaderboard_entries 
      SET country_rank = ranked.rank 
      FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY country ORDER BY score DESC, puzzles_completed DESC) as rank 
        FROM leaderboard_entries 
        WHERE country IS NOT NULL
      ) ranked 
      WHERE leaderboard_entries.id = ranked.id
    `)
  }

  async getUserRank(userId: string): Promise<{ globalRank: number; countryRank?: number }> {
    const entry = await this.leaderboardRepository.findOne({ where: { userId } })
    if (!entry) {
      return { globalRank: 0 }
    }

    return {
      globalRank: entry.globalRank || 0,
      countryRank: entry.countryRank || undefined,
    }
  }
}
