import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm"

export enum QueueStatus {
  WAITING = "waiting",
  MATCHED = "matched",
  LEFT = "left",
}

export enum SkillLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  EXPERT = "expert",
}

@Entity("puzzle_queue")
@Index(["status", "skillLevel"]) // Index for efficient matchmaking queries
@Index(["userId"]) // Index for user-specific queries
@Index(["createdAt"]) // Index for queue ordering
export class Queue {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid" })
  userId: string

  @Column({ type: "varchar", length: 100 })
  username: string

  @Column({
    type: "enum",
    enum: QueueStatus,
    default: QueueStatus.WAITING,
  })
  status: QueueStatus

  @Column({
    type: "enum",
    enum: SkillLevel,
    default: SkillLevel.BEGINNER,
  })
  skillLevel: SkillLevel

  @Column({ type: "varchar", length: 50, nullable: true })
  gameMode: string

  @Column({ type: "int", default: 0 })
  waitTime: number // in seconds

  @Column({ type: "uuid", nullable: true })
  matchId: string // Set when matched

  @Column({ type: "json", nullable: true })
  preferences: {
    maxWaitTime?: number
    preferredOpponents?: string[]
    avoidOpponents?: string[]
  }

  @CreateDateColumn()
  createdAt: Date

  @Column({ type: "timestamp", nullable: true })
  matchedAt: Date

  @Column({ type: "timestamp", nullable: true })
  leftAt: Date
}
