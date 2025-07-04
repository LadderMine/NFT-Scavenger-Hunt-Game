import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { UserAchievement } from "./user-achievement.entity"

export enum AchievementType {
  FIRST_PUZZLE_SOLVED = "first_puzzle_solved",
  TOP_10_GLOBAL = "top_10_global",
  TOP_10_COUNTRY = "top_10_country",
  DAILY_STREAK_7 = "daily_streak_7",
  DAILY_STREAK_30 = "daily_streak_30",
  SCORE_MILESTONE_1000 = "score_milestone_1000",
  SCORE_MILESTONE_5000 = "score_milestone_5000",
  SCORE_MILESTONE_10000 = "score_milestone_10000",
  PUZZLES_COMPLETED_10 = "puzzles_completed_10",
  PUZZLES_COMPLETED_50 = "puzzles_completed_50",
  PUZZLES_COMPLETED_100 = "puzzles_completed_100",
}

@Entity("achievements")
export class Achievement {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  name: string

  @Column()
  description: string

  @Column({ name: "icon_url" })
  iconUrl: string

  @Column({
    type: "enum",
    enum: AchievementType,
    unique: true,
  })
  type: AchievementType

  @Column({ name: "required_value", nullable: true })
  requiredValue: number

  @Column({ default: true })
  active: boolean

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date

  @OneToMany(
    () => UserAchievement,
    (userAchievement) => userAchievement.achievement,
  )
  userAchievements: UserAchievement[]
}
