import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, Unique } from "typeorm"

export enum Language {
  ENGLISH = "en",
  SPANISH = "es",
  FRENCH = "fr",
  GERMAN = "de",
  ITALIAN = "it",
  PORTUGUESE = "pt",
  RUSSIAN = "ru",
  JAPANESE = "ja",
  KOREAN = "ko",
  CHINESE_SIMPLIFIED = "zh-CN",
  CHINESE_TRADITIONAL = "zh-TW",
}

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
  AUTO = "auto",
}

export enum NotificationFrequency {
  IMMEDIATE = "immediate",
  HOURLY = "hourly",
  DAILY = "daily",
  WEEKLY = "weekly",
  NEVER = "never",
}

export enum SoundVolume {
  MUTED = 0,
  LOW = 25,
  MEDIUM = 50,
  HIGH = 75,
  MAX = 100,
}

@Entity("user_settings")
@Unique(["userId"]) // Ensure one settings record per user
@Index(["userId"]) // Index for efficient user lookups
export class UserSettings {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid" })
  userId: string

  // Display & Theme Settings
  @Column({
    type: "enum",
    enum: Language,
    default: Language.ENGLISH,
  })
  language: Language

  @Column({
    type: "enum",
    enum: Theme,
    default: Theme.AUTO,
  })
  theme: Theme

  @Column({ type: "boolean", default: false })
  darkMode: boolean // Legacy field, kept for backward compatibility

  @Column({ type: "varchar", length: 20, default: "UTC" })
  timezone: string

  @Column({ type: "varchar", length: 10, default: "12h" })
  timeFormat: string // "12h" or "24h"

  @Column({ type: "varchar", length: 10, default: "MM/DD/YYYY" })
  dateFormat: string

  // Notification Settings
  @Column({ type: "boolean", default: true })
  notificationsEnabled: boolean

  @Column({ type: "boolean", default: true })
  emailNotifications: boolean

  @Column({ type: "boolean", default: true })
  pushNotifications: boolean

  @Column({ type: "boolean", default: false })
  smsNotifications: boolean

  @Column({
    type: "enum",
    enum: NotificationFrequency,
    default: NotificationFrequency.IMMEDIATE,
  })
  notificationFrequency: NotificationFrequency

  @Column({ type: "json", nullable: true })
  notificationTypes: {
    gameUpdates?: boolean
    friendRequests?: boolean
    achievements?: boolean
    puzzleCompletions?: boolean
    leaderboardChanges?: boolean
    maintenanceAlerts?: boolean
  }

  // Audio Settings
  @Column({
    type: "enum",
    enum: SoundVolume,
    default: SoundVolume.MEDIUM,
  })
  masterVolume: SoundVolume

  @Column({
    type: "enum",
    enum: SoundVolume,
    default: SoundVolume.MEDIUM,
  })
  effectsVolume: SoundVolume

  @Column({
    type: "enum",
    enum: SoundVolume,
    default: SoundVolume.LOW,
  })
  musicVolume: SoundVolume

  @Column({ type: "boolean", default: true })
  soundEnabled: boolean

  // Game Settings
  @Column({ type: "boolean", default: false })
  autoSave: boolean

  @Column({ type: "int", default: 30 })
  autoSaveInterval: number // in seconds

  @Column({ type: "boolean", default: true })
  showHints: boolean

  @Column({ type: "boolean", default: false })
  skipAnimations: boolean

  @Column({ type: "varchar", length: 20, default: "normal" })
  difficulty: string // "easy", "normal", "hard", "expert"

  @Column({ type: "boolean", default: true })
  showTimer: boolean

  @Column({ type: "boolean", default: false })
  competitiveMode: boolean

  // Privacy Settings
  @Column({ type: "boolean", default: true })
  profileVisible: boolean

  @Column({ type: "boolean", default: true })
  showOnlineStatus: boolean

  @Column({ type: "boolean", default: false })
  allowFriendRequests: boolean

  @Column({ type: "boolean", default: true })
  showAchievements: boolean

  @Column({ type: "boolean", default: false })
  shareGameStats: boolean

  // Accessibility Settings
  @Column({ type: "boolean", default: false })
  highContrast: boolean

  @Column({ type: "boolean", default: false })
  largeText: boolean

  @Column({ type: "boolean", default: false })
  reducedMotion: boolean

  @Column({ type: "boolean", default: false })
  screenReader: boolean

  @Column({ type: "int", default: 100 })
  textSize: number // percentage

  // Custom Settings (flexible JSON field)
  @Column({ type: "json", nullable: true })
  customSettings: Record<string, any>

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
