import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity("leaderboard_entries")
@Index(["country"])
@Index(["score"])
@Index(["userId"], { unique: true })
export class LeaderboardEntry {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ name: "user_id", unique: true })
  userId: string

  @Column({ name: "username" })
  username: string

  @Column({ type: "integer", default: 0 })
  score: number

  @Column({ name: "puzzles_completed", type: "integer", default: 0 })
  puzzlesCompleted: number

  @Column({ name: "daily_streak", type: "integer", default: 0 })
  dailyStreak: number

  @Column({ name: "max_daily_streak", type: "integer", default: 0 })
  maxDailyStreak: number

  @Column({ name: "last_activity_date", nullable: true })
  lastActivityDate: Date

  @Column({ nullable: true })
  country: string

  @Column({ name: "global_rank", type: "integer", nullable: true })
  globalRank: number

  @Column({ name: "country_rank", type: "integer", nullable: true })
  countryRank: number

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}
