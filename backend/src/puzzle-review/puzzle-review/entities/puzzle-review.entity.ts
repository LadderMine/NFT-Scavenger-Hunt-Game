import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

export enum ReviewStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  FLAGGED = "flagged",
  DELETED = "deleted",
}

export enum ReviewType {
  RATING_ONLY = "rating_only",
  REVIEW_WITH_RATING = "review_with_rating",
  DETAILED_REVIEW = "detailed_review",
}

@Entity("puzzle_reviews")
@Index(["puzzleId", "status", "createdAt"])
@Index(["userId", "puzzleId"], { unique: true }) // One review per user per puzzle
@Index(["status", "createdAt"])
@Index(["rating", "createdAt"])
export class PuzzleReview {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid" })
  puzzleId: string

  @Column({ type: "uuid", nullable: true })
  userId: string // null for anonymous reviews

  @Column({ type: "varchar", length: 100, nullable: true })
  username: string // Display name for the review

  @Column({ type: "int", width: 1 })
  rating: number // 1-5 scale

  @Column({ type: "text", nullable: true })
  reviewText: string

  @Column({
    type: "enum",
    enum: ReviewType,
    default: ReviewType.RATING_ONLY,
  })
  reviewType: ReviewType

  @Column({
    type: "enum",
    enum: ReviewStatus,
    default: ReviewStatus.PENDING,
  })
  status: ReviewStatus

  @Column({ default: false })
  isAnonymous: boolean

  @Column({ default: false })
  isEdited: boolean

  @Column({ type: "timestamp", nullable: true })
  editedAt: Date

  @Column({ type: "json", nullable: true })
  metadata: {
    ipAddress?: string
    userAgent?: string
    deviceInfo?: string
    difficulty?: string
    completionTime?: number
    helpfulVotes?: number
    reportCount?: number
    [key: string]: any
  }

  @Column({ type: "json", nullable: true })
  moderationInfo: {
    moderatedBy?: string
    moderatedAt?: string
    moderationReason?: string
    autoModerated?: boolean
    flaggedReasons?: string[]
    [key: string]: any
  }

  @Column({ type: "simple-array", nullable: true })
  tags: string[] // User-defined tags for the review

  @Column({ default: 0 })
  helpfulCount: number // Number of users who found this review helpful

  @Column({ default: 0 })
  reportCount: number // Number of times this review was reported

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
