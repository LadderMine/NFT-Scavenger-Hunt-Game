import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm"
import { Achievement } from "./achievement.entity"

@Entity("user_achievements")
@Index(["userId", "achievementId"], { unique: true })
export class UserAchievement {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ name: "user_id" })
  userId: string

  @Column({ name: "achievement_id" })
  achievementId: string

  @Column({ name: "earned_at" })
  earnedAt: Date

  @Column({ name: "progress_value", nullable: true })
  progressValue: number

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @ManyToOne(
    () => Achievement,
    (achievement) => achievement.userAchievements,
  )
  @JoinColumn({ name: "achievement_id" })
  achievement: Achievement

  // Note: User entity relationship would be added here if User entity is available
  // @ManyToOne(() => User, user => user.achievements)
  // @JoinColumn({ name: 'user_id' })
  // user: User;
}
