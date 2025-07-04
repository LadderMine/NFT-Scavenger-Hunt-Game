import { Injectable, NotFoundException, BadRequestException, Logger } from "@nestjs/common"
import type { Repository } from "typeorm"
import { type UserSettings, Language, Theme, NotificationFrequency, SoundVolume } from "./entities/user-settings.entity"
import type { UpdateUserSettingsDto, CreateUserSettingsDto } from "./dto/user-settings.dto"
import type { UserSettingsResponseDto } from "./dto/user-settings-response.dto"
import type { SettingsCategoriesDto } from "./dto/settings-categories.dto"

@Injectable()
export class UserSettingsService {
  private readonly logger = new Logger(UserSettingsService.name)

  constructor(private readonly userSettingsRepository: Repository<UserSettings>) {}

  /**
   * Get user settings by user ID, create default if not exists
   */
  async getUserSettings(userId: string): Promise<UserSettingsResponseDto> {
    let userSettings = await this.userSettingsRepository.findOne({
      where: { userId },
    })

    if (!userSettings) {
      userSettings = await this.createDefaultSettings(userId)
      this.logger.log(`Created default settings for user ${userId}`)
    }

    return this.mapToResponseDto(userSettings)
  }

  /**
   * Update user settings
   */
  async updateUserSettings(userId: string, updateDto: UpdateUserSettingsDto): Promise<UserSettingsResponseDto> {
    let userSettings = await this.userSettingsRepository.findOne({
      where: { userId },
    })

    if (!userSettings) {
      // Create new settings if they don't exist
      userSettings = await this.createDefaultSettings(userId)
    }

    // Validate settings before updating
    this.validateSettings(updateDto)

    // Apply updates
    Object.assign(userSettings, updateDto)

    // Handle special logic
    this.applySettingsLogic(userSettings, updateDto)

    const savedSettings = await this.userSettingsRepository.save(userSettings)
    this.logger.log(`Updated settings for user ${userId}`)

    return this.mapToResponseDto(savedSettings)
  }

  /**
   * Create user settings with custom defaults
   */
  async createUserSettings(createDto: CreateUserSettingsDto): Promise<UserSettingsResponseDto> {
    const existingSettings = await this.userSettingsRepository.findOne({
      where: { userId: createDto.userId },
    })

    if (existingSettings) {
      throw new BadRequestException("User settings already exist")
    }

    this.validateSettings(createDto)

    const userSettings = this.userSettingsRepository.create({
      ...this.getDefaultSettings(),
      ...createDto,
    })

    this.applySettingsLogic(userSettings, createDto)

    const savedSettings = await this.userSettingsRepository.save(userSettings)
    this.logger.log(`Created settings for user ${createDto.userId}`)

    return this.mapToResponseDto(savedSettings)
  }

  /**
   * Delete user settings
   */
  async deleteUserSettings(userId: string): Promise<void> {
    const result = await this.userSettingsRepository.delete({ userId })

    if (result.affected === 0) {
      throw new NotFoundException("User settings not found")
    }

    this.logger.log(`Deleted settings for user ${userId}`)
  }

  /**
   * Reset user settings to defaults
   */
  async resetUserSettings(userId: string): Promise<UserSettingsResponseDto> {
    const userSettings = await this.userSettingsRepository.findOne({
      where: { userId },
    })

    if (!userSettings) {
      throw new NotFoundException("User settings not found")
    }

    // Reset to defaults while keeping the ID and timestamps
    const defaultSettings = this.getDefaultSettings()
    Object.assign(userSettings, defaultSettings)

    const savedSettings = await this.userSettingsRepository.save(userSettings)
    this.logger.log(`Reset settings to defaults for user ${userId}`)

    return this.mapToResponseDto(savedSettings)
  }

  /**
   * Get settings categories and available options
   */
  getSettingsCategories(): SettingsCategoriesDto {
    return {
      languages: [
        { value: Language.ENGLISH, label: "English" },
        { value: Language.SPANISH, label: "Español" },
        { value: Language.FRENCH, label: "Français" },
        { value: Language.GERMAN, label: "Deutsch" },
        { value: Language.ITALIAN, label: "Italiano" },
        { value: Language.PORTUGUESE, label: "Português" },
        { value: Language.RUSSIAN, label: "Русский" },
        { value: Language.JAPANESE, label: "日本語" },
        { value: Language.KOREAN, label: "한국어" },
        { value: Language.CHINESE_SIMPLIFIED, label: "简体中文" },
        { value: Language.CHINESE_TRADITIONAL, label: "繁體中文" },
      ],
      themes: [
        { value: Theme.LIGHT, label: "Light" },
        { value: Theme.DARK, label: "Dark" },
        { value: Theme.AUTO, label: "Auto" },
      ],
      notificationFrequencies: [
        { value: NotificationFrequency.IMMEDIATE, label: "Immediate" },
        { value: NotificationFrequency.HOURLY, label: "Hourly" },
        { value: NotificationFrequency.DAILY, label: "Daily" },
        { value: NotificationFrequency.WEEKLY, label: "Weekly" },
        { value: NotificationFrequency.NEVER, label: "Never" },
      ],
      volumeLevels: [
        { value: SoundVolume.MUTED, label: "Muted" },
        { value: SoundVolume.LOW, label: "Low" },
        { value: SoundVolume.MEDIUM, label: "Medium" },
        { value: SoundVolume.HIGH, label: "High" },
        { value: SoundVolume.MAX, label: "Max" },
      ],
      difficultyLevels: [
        { value: "easy", label: "Easy" },
        { value: "normal", label: "Normal" },
        { value: "hard", label: "Hard" },
        { value: "expert", label: "Expert" },
      ],
      timeFormats: [
        { value: "12h", label: "12 Hour" },
        { value: "24h", label: "24 Hour" },
      ],
      dateFormats: [
        { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
        { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
        { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
        { value: "DD-MM-YYYY", label: "DD-MM-YYYY" },
      ],
    }
  }

  /**
   * Export user settings (for data portability)
   */
  async exportUserSettings(userId: string): Promise<Record<string, any>> {
    const userSettings = await this.userSettingsRepository.findOne({
      where: { userId },
    })

    if (!userSettings) {
      throw new NotFoundException("User settings not found")
    }

    // Remove internal fields
    const { id, createdAt, updatedAt, ...exportableSettings } = userSettings
    return exportableSettings
  }

  /**
   * Import user settings (for data portability)
   */
  async importUserSettings(userId: string, settingsData: Record<string, any>): Promise<UserSettingsResponseDto> {
    // Validate imported data
    this.validateSettings(settingsData)

    let userSettings = await this.userSettingsRepository.findOne({
      where: { userId },
    })

    if (!userSettings) {
      userSettings = await this.createDefaultSettings(userId)
    }

    // Apply imported settings
    Object.assign(userSettings, settingsData)
    this.applySettingsLogic(userSettings, settingsData)

    const savedSettings = await this.userSettingsRepository.save(userSettings)
    this.logger.log(`Imported settings for user ${userId}`)

    return this.mapToResponseDto(savedSettings)
  }

  /**
   * Create default settings for a user
   */
  private async createDefaultSettings(userId: string): Promise<UserSettings> {
    const defaultSettings = this.userSettingsRepository.create({
      userId,
      ...this.getDefaultSettings(),
    })

    return await this.userSettingsRepository.save(defaultSettings)
  }

  /**
   * Get default settings values
   */
  private getDefaultSettings(): Partial<UserSettings> {
    return {
      language: Language.ENGLISH,
      theme: Theme.AUTO,
      darkMode: false,
      timezone: "UTC",
      timeFormat: "12h",
      dateFormat: "MM/DD/YYYY",
      notificationsEnabled: true,
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      notificationFrequency: NotificationFrequency.IMMEDIATE,
      notificationTypes: {
        gameUpdates: true,
        friendRequests: true,
        achievements: true,
        puzzleCompletions: true,
        leaderboardChanges: false,
        maintenanceAlerts: true,
      },
      masterVolume: SoundVolume.MEDIUM,
      effectsVolume: SoundVolume.MEDIUM,
      musicVolume: SoundVolume.LOW,
      soundEnabled: true,
      autoSave: false,
      autoSaveInterval: 30,
      showHints: true,
      skipAnimations: false,
      difficulty: "normal",
      showTimer: true,
      competitiveMode: false,
      profileVisible: true,
      showOnlineStatus: true,
      allowFriendRequests: false,
      showAchievements: true,
      shareGameStats: false,
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false,
      textSize: 100,
    }
  }

  /**
   * Validate settings data
   */
  private validateSettings(settings: Partial<UserSettings>): void {
    // Custom validation logic
    if (settings.autoSaveInterval !== undefined) {
      if (settings.autoSaveInterval < 10 || settings.autoSaveInterval > 300) {
        throw new BadRequestException("Auto-save interval must be between 10 and 300 seconds")
      }
    }

    if (settings.textSize !== undefined) {
      if (settings.textSize < 75 || settings.textSize > 200) {
        throw new BadRequestException("Text size must be between 75% and 200%")
      }
    }

    // Validate notification types structure
    if (settings.notificationTypes) {
      const validKeys = [
        "gameUpdates",
        "friendRequests",
        "achievements",
        "puzzleCompletions",
        "leaderboardChanges",
        "maintenanceAlerts",
      ]
      const providedKeys = Object.keys(settings.notificationTypes)
      const invalidKeys = providedKeys.filter((key) => !validKeys.includes(key))

      if (invalidKeys.length > 0) {
        throw new BadRequestException(`Invalid notification type keys: ${invalidKeys.join(", ")}`)
      }
    }

    // Validate timezone format (basic check)
    if (settings.timezone && !this.isValidTimezone(settings.timezone)) {
      throw new BadRequestException("Invalid timezone format")
    }
  }

  /**
   * Apply special settings logic
   */
  private applySettingsLogic(userSettings: UserSettings, updateDto: Partial<UserSettings>): void {
    // Auto-disable notifications if master switch is off
    if (updateDto.notificationsEnabled === false) {
      userSettings.emailNotifications = false
      userSettings.pushNotifications = false
      userSettings.smsNotifications = false
    }

    // Auto-mute all volumes if sound is disabled
    if (updateDto.soundEnabled === false) {
      userSettings.masterVolume = SoundVolume.MUTED
      userSettings.effectsVolume = SoundVolume.MUTED
      userSettings.musicVolume = SoundVolume.MUTED
    }

    // Sync theme with darkMode for backward compatibility
    if (updateDto.theme === Theme.DARK) {
      userSettings.darkMode = true
    } else if (updateDto.theme === Theme.LIGHT) {
      userSettings.darkMode = false
    }

    // Enable reduced motion if screen reader is enabled
    if (updateDto.screenReader === true) {
      userSettings.reducedMotion = true
      userSettings.skipAnimations = true
    }

    // Merge notification types with existing ones
    if (updateDto.notificationTypes) {
      userSettings.notificationTypes = {
        ...userSettings.notificationTypes,
        ...updateDto.notificationTypes,
      }
    }

    // Merge custom settings with existing ones
    if (updateDto.customSettings) {
      userSettings.customSettings = {
        ...userSettings.customSettings,
        ...updateDto.customSettings,
      }
    }
  }

  /**
   * Basic timezone validation
   */
  private isValidTimezone(timezone: string): boolean {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: timezone })
      return true
    } catch {
      return false
    }
  }

  /**
   * Map entity to response DTO
   */
  private mapToResponseDto(userSettings: UserSettings): UserSettingsResponseDto {
    return {
      id: userSettings.id,
      userId: userSettings.userId,
      language: userSettings.language,
      theme: userSettings.theme,
      darkMode: userSettings.darkMode,
      timezone: userSettings.timezone,
      timeFormat: userSettings.timeFormat,
      dateFormat: userSettings.dateFormat,
      notificationsEnabled: userSettings.notificationsEnabled,
      emailNotifications: userSettings.emailNotifications,
      pushNotifications: userSettings.pushNotifications,
      smsNotifications: userSettings.smsNotifications,
      notificationFrequency: userSettings.notificationFrequency,
      notificationTypes: userSettings.notificationTypes,
      masterVolume: userSettings.masterVolume,
      effectsVolume: userSettings.effectsVolume,
      musicVolume: userSettings.musicVolume,
      soundEnabled: userSettings.soundEnabled,
      autoSave: userSettings.autoSave,
      autoSaveInterval: userSettings.autoSaveInterval,
      showHints: userSettings.showHints,
      skipAnimations: userSettings.skipAnimations,
      difficulty: userSettings.difficulty,
      showTimer: userSettings.showTimer,
      competitiveMode: userSettings.competitiveMode,
      profileVisible: userSettings.profileVisible,
      showOnlineStatus: userSettings.showOnlineStatus,
      allowFriendRequests: userSettings.allowFriendRequests,
      showAchievements: userSettings.showAchievements,
      shareGameStats: userSettings.shareGameStats,
      highContrast: userSettings.highContrast,
      largeText: userSettings.largeText,
      reducedMotion: userSettings.reducedMotion,
      screenReader: userSettings.screenReader,
      textSize: userSettings.textSize,
      customSettings: userSettings.customSettings,
      createdAt: userSettings.createdAt,
      updatedAt: userSettings.updatedAt,
    }
  }
}
