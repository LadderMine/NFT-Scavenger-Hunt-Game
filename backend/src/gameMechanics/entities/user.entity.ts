import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { PuzzleSubmission } from "./puzzle-submission.entity"
import { ChallengeCompletion } from "./challenge-completion.entity"
import { HintUsage } from "./hint-usage.entity"

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  email: string

  @Column()
  username: string

  @Column()
  password: string

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole

  @Column({ type: "int", default: 0 })
  totalPoints: number

  @Column({ type: "int", default: 0 })
  challengesCompleted: number

  @Column({ type: "boolean", default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(
    () => PuzzleSubmission,
    (submission) => submission.user,
  )
  submissions: PuzzleSubmission[]

  @OneToMany(
    () => ChallengeCompletion,
    (completion) => completion.user,
  )
  completions: ChallengeCompletion[]

  @OneToMany(
    () => HintUsage,
    (hintUsage) => hintUsage.user,
  )
  hintUsages: HintUsage[]
}
