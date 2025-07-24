import { IsBoolean, IsEnum, IsOptional, IsString, IsInt, Min, Max, IsObject, IsUUID, Matches } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Language, Theme, NotificationFrequency, SoundVolume } from "../entities/user-settings.entity"

export class UpdateUserSettingsDto {
  // Display & Theme Settings
  @ApiPropertyOptional({
    description: "User's preferred language",
    enum: Language,
    example: Language.ENGLISH,
  })
  @IsEnum(Language)
  @IsOptional()
  language?: Language

  @ApiPropertyOptional({
    description: "Theme preference",
    enum: Theme,
    example: Theme.AUTO,
  })
  @IsEnum(Theme)
  @IsOptional()
  theme?: Theme

  @ApiPropertyOptional({
    description: "Dark mode enabled (legacy field)",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  darkMode?: boolean

  @ApiPropertyOptional({
    description: "User's timezone",
    example: "America/New_York",
  })
  @IsString()
  @IsOptional()
  timezone?: string

  @ApiPropertyOptional({
    description: "Time format preference",
    example: "12h",
    enum: ["12h", "24h"],
  })
  @IsString()
  @Matches(/^(12h|24h)$/, { message: "Time format must be either '12h' or '24h'" })
  @IsOptional()
  timeFormat?: string

  @ApiPropertyOptional({
    description: "Date format preference",
    example: "MM/DD/YYYY",
  })
  @IsString()
  @IsOptional()
  dateFormat?: string

  // Notification Settings
  @ApiPropertyOptional({
    description: "Enable all notifications",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  notificationsEnabled?: boolean

  @ApiPropertyOptional({
    description: "Enable email notifications",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  emailNotifications?: boolean

  @ApiPropertyOptional({
    description: "Enable push notifications",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  pushNotifications?: boolean

  @ApiPropertyOptional({
    description: "Enable SMS notifications",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  smsNotifications?: boolean

  @ApiPropertyOptional({
    description: "Notification frequency",
    enum: NotificationFrequency,
    example: NotificationFrequency.IMMEDIATE,
  })
  @IsEnum(NotificationFrequency)
  @IsOptional()
  notificationFrequency?: NotificationFrequency

  @ApiPropertyOptional({
    description: "Specific notification type preferences",
    example: {
      gameUpdates: true,
      friendRequests: true,
      achievements: true,
      puzzleCompletions: false,
      leaderboardChanges: true,
      maintenanceAlerts: true,
    },
  })
  @IsObject()
  @IsOptional()
  notificationTypes?: {
    gameUpdates?: boolean
    friendRequests?: boolean
    achievements?: boolean
    puzzleCompletions?: boolean
    leaderboardChanges?: boolean
    maintenanceAlerts?: boolean
  }

  // Audio Settings
  @ApiPropertyOptional({
    description: "Master volume level",
    enum: SoundVolume,
    example: SoundVolume.MEDIUM,
  })
  @IsEnum(SoundVolume)
  @IsOptional()
  masterVolume?: SoundVolume

  @ApiPropertyOptional({
    description: "Sound effects volume level",
    enum: SoundVolume,
    example: SoundVolume.MEDIUM,
  })
  @IsEnum(SoundVolume)
  @IsOptional()
  effectsVolume?: SoundVolume

  @ApiPropertyOptional({
    description: "Music volume level",
    enum: SoundVolume,
    example: SoundVolume.LOW,
  })
  @IsEnum(SoundVolume)
  @IsOptional()
  musicVolume?: SoundVolume

  @ApiPropertyOptional({
    description: "Enable sound",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  soundEnabled?: boolean

  // Game Settings
  @ApiPropertyOptional({
    description: "Enable auto-save",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  autoSave?: boolean

  @ApiPropertyOptional({
    description: "Auto-save interval in seconds",
    example: 30,
    minimum: 10,
    maximum: 300,
  })
  @IsInt()
  @Min(10)
  @Max(300)
  @IsOptional()
  autoSaveInterval?: number

  @ApiPropertyOptional({
    description: "Show hints during gameplay",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  showHints?: boolean

  @ApiPropertyOptional({
    description: "Skip animations for faster gameplay",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  skipAnimations?: boolean

  @ApiPropertyOptional({
    description: "Game difficulty level",
    example: "normal",
    enum: ["easy", "normal", "hard", "expert"],
  })
  @IsString()
  @Matches(/^(easy|normal|hard|expert)$/, { message: "Difficulty must be one of: easy, normal, hard, expert" })
  @IsOptional()
  difficulty?: string

  @ApiPropertyOptional({
    description: "Show timer during gameplay",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  showTimer?: boolean

  @ApiPropertyOptional({
    description: "Enable competitive mode",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  competitiveMode?: boolean

  // Privacy Settings
  @ApiPropertyOptional({
    description: "Make profile visible to other users",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  profileVisible?: boolean

  @ApiPropertyOptional({
    description: "Show online status to other users",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  showOnlineStatus?: boolean

  @ApiPropertyOptional({
    description: "Allow friend requests from other users",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  allowFriendRequests?: boolean

  @ApiPropertyOptional({
    description: "Show achievements on profile",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  showAchievements?: boolean

  @ApiPropertyOptional({
    description: "Share game statistics publicly",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  shareGameStats?: boolean

  // Accessibility Settings
  @ApiPropertyOptional({
    description: "Enable high contrast mode",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  highContrast?: boolean

  @ApiPropertyOptional({
    description: "Enable large text mode",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  largeText?: boolean

  @ApiPropertyOptional({
    description: "Reduce motion and animations",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  reducedMotion?: boolean

  @ApiPropertyOptional({
    description: "Enable screen reader compatibility",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  screenReader?: boolean

  @ApiPropertyOptional({
    description: "Text size percentage",
    example: 100,
    minimum: 75,
    maximum: 200,
  })
  @IsInt()
  @Min(75)
  @Max(200)
  @IsOptional()
  textSize?: number

  // Custom Settings
  @ApiPropertyOptional({
    description: "Custom user-defined settings",
    example: { customTheme: "neon", favoriteColor: "blue" },
  })
  @IsObject()
  @IsOptional()
  customSettings?: Record<string, any>
}

export class CreateUserSettingsDto extends UpdateUserSettingsDto {
  @ApiProperty({
    description: "User ID for the settings",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  userId: string
}
