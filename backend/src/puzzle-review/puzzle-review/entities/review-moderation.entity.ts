import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

export enum ModerationAction {
  APPROVE = "approve",
  REJECT = "reject",
  DELETE = "delete",
  FLAG = "flag",
  UNFLAG = "unflag",
  EDIT = "edit",
}

export enum ModerationReason {
  INAPPROPRIATE_CONTENT = "inappropriate_content",
  SPAM = "spam",
  OFF_TOPIC = "off_topic",
  PERSONAL_ATTACK = "personal_attack",
  FAKE_REVIEW = "fake_review",
  DUPLICATE = "duplicate",
  LOW_QUALITY = "low_quality",
  LANGUAGE_VIOLATION = "language_violation",
  OTHER = "other",
}

@Entity("review_moderation")
export class ReviewModeration {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid" })
  reviewId: string

  @Column({ type: "uuid" })
  moderatorId: string

  @Column({
    type: "enum",
    enum: ModerationAction,
  })
  action: ModerationAction

  @Column({
    type: "enum",
    enum: ModerationReason,
    nullable: true,
  })
  reason: ModerationReason

  @Column({ type: "text", nullable: true })
  notes: string

  @Column({ type: "json", nullable: true })
  previousData: {
    status?: string
    reviewText?: string
    rating?: number
    [key: string]: any
  }

  @Column({ default: false })
  isAutoModeration: boolean

  @CreateDateColumn()
  createdAt: Date
}
