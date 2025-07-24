import { ApiProperty } from "@nestjs/swagger"
import { Language, Theme, NotificationFrequency, SoundVolume } from "../entities/user-settings.entity"

export class UserSettingsResponseDto {
  @ApiProperty({
    description: "Settings ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string

  @ApiProperty({
    description: "User ID",
    example: "456e7890-e89b-12d3-a456-426614174001",
  })
  userId: string

  // Display & Theme Settings
  @ApiProperty({
    description: "User's preferred language",
    enum: Language,
    example: Language.ENGLISH,
  })
  language: Language

  @ApiProperty({
    description: "Theme preference",
    enum: Theme,
    example: Theme.AUTO,
  })
  theme: Theme

  @ApiProperty({
    description: "Dark mode enabled",
    example: false,
  })
  darkMode: boolean

  @ApiProperty({
    description: "User's timezone",
    example: "America/New_York",
  })
  timezone: string

  @ApiProperty({
    description: "Time format preference",
    example: "12h",
  })
  timeFormat: string

  @ApiProperty({
    description: "Date format preference",
    example: "MM/DD/YYYY",
  })
  dateFormat: string

  // Notification Settings
  @ApiProperty({
    description: "Enable all notifications",
    example: true,
  })
  notificationsEnabled: boolean

  @ApiProperty({
    description: "Enable email notifications",
    example: true,
  })
  emailNotifications: boolean

  @ApiProperty({
    description: "Enable push notifications",
    example: true,
  })
  pushNotifications: boolean

  @ApiProperty({
    description: "Enable SMS notifications",
    example: false,
  })
  smsNotifications: boolean

  @ApiProperty({
    description: "Notification frequency",
    enum: NotificationFrequency,
    example: NotificationFrequency.IMMEDIATE,
  })
  notificationFrequency: NotificationFrequency

  @ApiProperty({
    description: "Specific notification type preferences",
    example: {
      gameUpdates: true,
      friendRequests: true,
      achievements: true,
      puzzleCompletions: false,
      leaderboardChanges: true,
      maintenanceAlerts: true,
    },
    nullable: true,
  })
  notificationTypes: {
    gameUpdates?: boolean
    friendRequests?: boolean
    achievements?: boolean
    puzzleCompletions?: boolean
    leaderboardChanges?: boolean
    maintenanceAlerts?: boolean
  } | null

  // Audio Settings
  @ApiProperty({
    description: "Master volume level",
    enum: SoundVolume,
    example: SoundVolume.MEDIUM,
  })
  masterVolume: SoundVolume

  @ApiProperty({
    description: "Sound effects volume level",
    enum: SoundVolume,
    example: SoundVolume.MEDIUM,
  })
  effectsVolume: SoundVolume

  @ApiProperty({
    description: "Music volume level",
    enum: SoundVolume,
    example: SoundVolume.LOW,
  })
  musicVolume: SoundVolume

  @ApiProperty({
    description: "Enable sound",
    example: true,
  })
  soundEnabled: boolean

  // Game Settings
  @ApiProperty({
    description: "Enable auto-save",
    example: false,
  })
  autoSave: boolean

  @ApiProperty({
    description: "Auto-save interval in seconds",
    example: 30,
  })
  autoSaveInterval: number

  @ApiProperty({
    description: "Show hints during gameplay",
    example: true,
  })
  showHints: boolean

  @ApiProperty({
    description: "Skip animations for faster gameplay",
    example: false,
  })
  skipAnimations: boolean

  @ApiProperty({
    description: "Game difficulty level",
    example: "normal",
  })
  difficulty: string

  @ApiProperty({
    description: "Show timer during gameplay",
    example: true,
  })
  showTimer: boolean

  @ApiProperty({
    description: "Enable competitive mode",
    example: false,
  })
  competitiveMode: boolean

  // Privacy Settings
  @ApiProperty({
    description: "Make profile visible to other users",
    example: true,
  })
  profileVisible: boolean

  @ApiProperty({
    description: "Show online status to other users",
    example: true,
  })
  showOnlineStatus: boolean

  @ApiProperty({
    description: "Allow friend requests from other users",
    example: false,
  })
  allowFriendRequests: boolean

  @ApiProperty({
    description: "Show achievements on profile",
    example: true,
  })
  showAchievements: boolean

  @ApiProperty({
    description: "Share game statistics publicly",
    example: false,
  })
  shareGameStats: boolean

  // Accessibility Settings
  @ApiProperty({
    description: "Enable high contrast mode",
    example: false,
  })
  highContrast: boolean

  @ApiProperty({
    description: "Enable large text mode",
    example: false,
  })
  largeText: boolean

  @ApiProperty({
    description: "Reduce motion and animations",
    example: false,
  })
  reducedMotion: boolean

  @ApiProperty({
    description: "Enable screen reader compatibility",
    example: false,
  })
  screenReader: boolean

  @ApiProperty({
    description: "Text size percentage",
    example: 100,
  })
  textSize: number

  // Custom Settings
  @ApiProperty({
    description: "Custom user-defined settings",
    example: { customTheme: "neon", favoriteColor: "blue" },
    nullable: true,
  })
  customSettings: Record<string, any> | null

  @ApiProperty({
    description: "Settings creation timestamp",
    example: "2024-01-15T10:30:00Z",
  })
  createdAt: Date

  @ApiProperty({
    description: "Settings last update timestamp",
    example: "2024-01-15T14:45:00Z",
  })
  updatedAt: Date
}
