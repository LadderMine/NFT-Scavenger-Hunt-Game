import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, Unique } from "typeorm"
import { MilestoneCategory } from "./milestone-template.entity"

@Entity("user_progress")
@Unique(["userId", "category", "progressKey"])
@Index(["userId"])
@Index(["category"])
export class UserProgress {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid" })
  userId: string

  @Column({
    type: "enum",
    enum: MilestoneCategory,
  })
  category: MilestoneCategory

  @Column({ type: "varchar", length: 100 })
  progressKey: string // e.g., "puzzles_completed", "current_streak", "social_shares"

  @Column({ type: "int", default: 0 })
  currentValue: number

  @Column({ type: "int", default: 0 })
  totalValue: number // For tracking lifetime totals

  @Column({ type: "date", nullable: true })
  lastUpdated: Date

  @Column({ type: "text", nullable: true })
  metadata: string // Additional progress data as JSON

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
