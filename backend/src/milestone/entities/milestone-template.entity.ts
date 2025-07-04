import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

export enum MilestoneCategory {
  PUZZLE = "puzzle",
  STREAK = "streak",
  SOCIAL = "social",
  ENGAGEMENT = "engagement",
  SPECIAL = "special",
}

export enum MilestoneType {
  COUNT_BASED = "count_based", // Based on reaching a specific count
  STREAK_BASED = "streak_based", // Based on consecutive actions
  TIME_BASED = "time_based", // Based on time periods
  PERCENTAGE_BASED = "percentage_based", // Based on completion rates
  CUSTOM = "custom", // Custom logic
}

@Entity("milestone_templates")
@Index(["category", "isActive"])
@Index(["milestoneType"])
export class MilestoneTemplate {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "varchar", length: 100 })
  title: string

  @Column({ type: "text" })
  description: string

  @Column({
    type: "enum",
    enum: MilestoneCategory,
    default: MilestoneCategory.PUZZLE,
  })
  category: MilestoneCategory

  @Column({
    type: "enum",
    enum: MilestoneType,
    default: MilestoneType.COUNT_BASED,
  })
  milestoneType: MilestoneType

  @Column({ type: "int", nullable: true })
  requiredCount: number // For count-based milestones (e.g., 10 puzzles)

  @Column({ type: "int", nullable: true })
  requiredStreak: number // For streak-based milestones

  @Column({ type: "int", nullable: true })
  requiredDays: number // For time-based milestones

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  requiredPercentage: number // For percentage-based milestones

  @Column({ type: "text", nullable: true })
  customCriteria: string // JSON string for custom milestone logic

  @Column({ type: "int", default: 0 })
  points: number // Points awarded for achieving this milestone

  @Column({ type: "varchar", length: 50, nullable: true })
  badgeIcon: string // Icon identifier for the milestone badge

  @Column({ type: "varchar", length: 20, nullable: true })
  badgeColor: string // Color for the milestone badge

  @Column({ type: "int", default: 0 })
  sortOrder: number // For ordering milestones

  @Column({ type: "boolean", default: true })
  isActive: boolean

  @Column({ type: "boolean", default: false })
  isHidden: boolean // Hidden milestones (surprise achievements)

  @Column({ type: "text", nullable: true })
  metadata: string // Additional metadata as JSON

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
