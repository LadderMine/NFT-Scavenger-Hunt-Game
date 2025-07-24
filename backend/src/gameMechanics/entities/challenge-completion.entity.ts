import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./user.entity"
import { Challenge } from "./challenge.entity"

@Entity("challenge_completions")
export class ChallengeCompletion {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("uuid")
  userId: string

  @Column("uuid")
  challengeId: string

  @Column({ type: "int" })
  pointsEarned: number

  @Column({ type: "int" })
  attemptsUsed: number

  @Column({ type: "int" })
  hintsUsed: number

  @Column({ type: "int", nullable: true })
  totalTimeTaken: number // in seconds

  @CreateDateColumn()
  completedAt: Date

  @ManyToOne(
    () => User,
    (user) => user.completions,
  )
  @JoinColumn({ name: "userId" })
  user: User

  @ManyToOne(
    () => Challenge,
    (challenge) => challenge.completions,
  )
  @JoinColumn({ name: "challengeId" })
  challenge: Challenge
}
