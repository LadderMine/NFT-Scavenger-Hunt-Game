import { Injectable } from "@nestjs/common"

export interface StreakCalculationConfig {
  gracePeriodHours: number // Hours after midnight to still count as previous day
  timezoneOffset: number // User's timezone offset in hours
  resetAfterDays: number // Days of inactivity before streak resets
}

@Injectable()
export class StreakCalculationService {
  private readonly defaultConfig: StreakCalculationConfig = {
    gracePeriodHours: 6, // 6 AM grace period
    timezoneOffset: 0, // UTC by default
    resetAfterDays: 2, // Reset after 2 days of inactivity
  }

  calculateStreakForDates(
    activityDates: Date[],
    config: Partial<StreakCalculationConfig> = {},
  ): {
    currentStreak: number
    longestStreak: number
    streakStartDate: Date | null
    shouldReset: boolean
  } {
    const fullConfig = { ...this.defaultConfig, ...config }

    if (activityDates.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        streakStartDate: null,
        shouldReset: false,
      }
    }

    // Sort dates in descending order (most recent first)
    const sortedDates = activityDates
      .map((date) => this.normalizeDate(date, fullConfig.timezoneOffset))
      .sort((a, b) => b.getTime() - a.getTime())

    // Remove duplicates (same day activities)
    const uniqueDates = Array.from(new Set(sortedDates.map((date) => date.toDateString()))).map(
      (dateString) => new Date(dateString),
    )

    const today = this.normalizeDate(new Date(), fullConfig.timezoneOffset)
    const mostRecentActivity = uniqueDates[0]

    // Check if streak should be reset
    const daysSinceLastActivity = this.getDaysDifference(mostRecentActivity, today)
    const shouldReset = daysSinceLastActivity > fullConfig.resetAfterDays

    if (shouldReset) {
      return {
        currentStreak: 0,
        longestStreak: this.calculateLongestStreak(uniqueDates),
        streakStartDate: null,
        shouldReset: true,
      }
    }

    // Calculate current streak
    const currentStreak = this.calculateCurrentStreak(uniqueDates, today, fullConfig)
    const longestStreak = Math.max(this.calculateLongestStreak(uniqueDates), currentStreak)

    const streakStartDate = currentStreak > 0 ? uniqueDates[Math.min(currentStreak - 1, uniqueDates.length - 1)] : null

    return {
      currentStreak,
      longestStreak,
      streakStartDate,
      shouldReset: false,
    }
  }

  private calculateCurrentStreak(sortedUniqueDates: Date[], today: Date, config: StreakCalculationConfig): number {
    if (sortedUniqueDates.length === 0) return 0

    let streak = 0
    let expectedDate = today

    // Check if today has activity or if we're within grace period
    const mostRecentActivity = sortedUniqueDates[0]
    const daysSinceLastActivity = this.getDaysDifference(mostRecentActivity, today)

    // If last activity was today or yesterday, start counting
    if (daysSinceLastActivity <= 1) {
      for (let i = 0; i < sortedUniqueDates.length; i++) {
        const activityDate = sortedUniqueDates[i]
        const daysDiff = this.getDaysDifference(activityDate, expectedDate)

        if (daysDiff === 0) {
          // Activity on expected date
          streak++
          expectedDate = this.subtractDays(expectedDate, 1)
        } else if (daysDiff === 1 && i === 0) {
          // First activity was yesterday, still counts
          streak++
          expectedDate = this.subtractDays(activityDate, 1)
        } else {
          // Gap in streak
          break
        }
      }
    }

    return streak
  }

  private calculateLongestStreak(sortedUniqueDates: Date[]): number {
    if (sortedUniqueDates.length === 0) return 0

    let longestStreak = 1
    let currentStreak = 1

    for (let i = 1; i < sortedUniqueDates.length; i++) {
      const currentDate = sortedUniqueDates[i]
      const previousDate = sortedUniqueDates[i - 1]
      const daysDiff = this.getDaysDifference(currentDate, previousDate)

      if (daysDiff === 1) {
        currentStreak++
        longestStreak = Math.max(longestStreak, currentStreak)
      } else {
        currentStreak = 1
      }
    }

    return longestStreak
  }

  private normalizeDate(date: Date, timezoneOffset: number): Date {
    const normalized = new Date(date)
    normalized.setHours(0, 0, 0, 0)
    normalized.setHours(normalized.getHours() - timezoneOffset)
    return normalized
  }

  private getDaysDifference(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000
    return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay))
  }

  private subtractDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() - days)
    return result
  }

  getDaysUntilReset(lastActivityDate: Date, config: Partial<StreakCalculationConfig> = {}): number {
    const fullConfig = { ...this.defaultConfig, ...config }
    const today = this.normalizeDate(new Date(), fullConfig.timezoneOffset)
    const daysSinceActivity = this.getDaysDifference(lastActivityDate, today)
    return Math.max(0, fullConfig.resetAfterDays - daysSinceActivity)
  }
}
