import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { PuzzleSubmission } from "./puzzle-submission.entity"
import { ChallengeCompletion } from "./challenge-completion.entity"
import { HintUsage } from "./hint-usage.entity"

export enum ChallengeDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
  EXPERT = "expert",
}

export enum ChallengeType {
  TEXT = "text",
  NUMBER = "number",
  MULTIPLE_CHOICE = "multiple_choice",
  IMAGE = "image",
  CODE = "code",
}

export enum ChallengeStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  ARCHIVED = "archived",
}

@Entity("challenges")
export class Challenge {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ length: 255 })
  title: string

  @Column("text")
  description: string

  @Column("text")
  question: string

  @Column("text")
  correctAnswer: string

  @Column({
    type: "enum",
    enum: ChallengeType,
    default: ChallengeType.TEXT,
  })
  type: ChallengeType

  @Column({
    type: "enum",
    enum: ChallengeDifficulty,
    default: ChallengeDifficulty.EASY,
  })
  difficulty: ChallengeDifficulty

  @Column({
    type: "enum",
    enum: ChallengeStatus,
    default: ChallengeStatus.DRAFT,
  })
  status: ChallengeStatus

  @Column({ type: "timestamp", nullable: true })
  unlockTime: Date

  @Column({ type: "timestamp", nullable: true })
  expiryTime: Date

  @Column({ type: "int", default: 100 })
  points: number

  @Column({ type: "int", default: 3 })
  maxAttempts: number

  @Column({ type: "int", default: 3 })
  maxHints: number

  @Column("text", { array: true, default: [] })
  hints: string[]

  @Column("text", { array: true, nullable: true })
  multipleChoiceOptions: string[]

  @Column({ type: "text", nullable: true })
  imageUrl: string

  @Column({ type: "boolean", default: true })
  caseSensitive: boolean

  @Column({ type: "boolean", default: false })
  fuzzyMatching: boolean

  @Column({ type: "int", default: 0 })
  order: number

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(
    () => PuzzleSubmission,
    (submission) => submission.challenge,
  )
  submissions: PuzzleSubmission[]

  @OneToMany(
    () => ChallengeCompletion,
    (completion) => completion.challenge,
  )
  completions: ChallengeCompletion[]

  @OneToMany(
    () => HintUsage,
    (hintUsage) => hintUsage.challenge,
  )
  hintUsages: HintUsage[]
}
