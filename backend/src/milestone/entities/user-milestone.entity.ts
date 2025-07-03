import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, Index, Unique } from "typeorm"
import { MilestoneTemplate } from "./milestone-template.entity"

@Entity("user_milestones")
@Unique(["userId", "milestoneTemplateId"])
@Index(["userId"])
@Index(["achievedAt"])
@Index(["milestoneTemplateId"])
export class UserMilestone {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid" })
  userId: string

  @Column({ type: "uuid" })
  milestoneTemplateId: string

  @ManyToOne(() => MilestoneTemplate, { eager: true })
  @JoinColumn({ name: "milestoneTemplateId" })
  milestoneTemplate: MilestoneTemplate

  @Column({ type: "timestamp" })
  achievedAt: Date

  @Column({ type: "int", nullable: true })
  achievedValue: number // The actual value when milestone was achieved (e.g., 15 when milestone was for 10)

  @Column({ type: "text", nullable: true })
  achievementContext: string // JSON string with context about how it was achieved

  @Column({ type: "boolean", default: false })
  isNotified: boolean // Whether user has been notified about this achievement

  @Column({ type: "boolean", default: false })
  isViewed: boolean // Whether user has viewed this achievement

  @CreateDateColumn()
  createdAt: Date
}
