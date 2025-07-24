import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, Index } from "typeorm"
import { Streak } from "./streak.entity"

export enum ActivityType {
  LOGIN = "login",
  POST_CREATED = "post_created",
  COMMENT_MADE = "comment_made",
  TASK_COMPLETED = "task_completed",
  CUSTOM = "custom",
}

@Entity("streak_activities")
@Index(["userId", "activityDate"])
@Index(["streakId"])
@Index(["activityType"])
export class StreakActivity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid" })
  streakId: string

  @ManyToOne(() => Streak, { onDelete: "CASCADE" })
  @JoinColumn({ name: "streakId" })
  streak: Streak

  @Column({ type: "uuid" })
  userId: string

  @Column({ type: "date" })
  activityDate: Date

  @Column({
    type: "enum",
    enum: ActivityType,
    default: ActivityType.LOGIN,
  })
  activityType: ActivityType

  @Column({ type: "int", default: 1 })
  activityCount: number

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ type: "text", nullable: true })
  metadata: string // JSON string for additional activity data

  @CreateDateColumn()
  createdAt: Date
}
