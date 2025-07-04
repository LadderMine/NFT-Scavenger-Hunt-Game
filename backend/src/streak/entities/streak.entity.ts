import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, Unique } from "typeorm"

@Entity("streaks")
@Unique(["userId"])
@Index(["userId"])
@Index(["currentStreak"])
@Index(["lastActivityDate"])
export class Streak {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid" })
  userId: string

  @Column({ type: "int", default: 0 })
  currentStreak: number

  @Column({ type: "int", default: 0 })
  longestStreak: number

  @Column({ type: "date", nullable: true })
  lastActivityDate: Date

  @Column({ type: "date", nullable: true })
  streakStartDate: Date

  @Column({ type: "int", default: 0 })
  totalActiveDays: number

  @Column({ type: "boolean", default: true })
  isActive: boolean

  @Column({ type: "timestamp", nullable: true })
  lastResetAt: Date

  @Column({ type: "text", nullable: true })
  metadata: string // JSON string for additional data like activity types

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
