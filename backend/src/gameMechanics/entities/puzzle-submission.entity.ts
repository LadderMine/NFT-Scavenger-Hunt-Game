import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./user.entity"
import { Challenge } from "./challenge.entity"

@Entity("puzzle_submissions")
export class PuzzleSubmission {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("uuid")
  userId: string

  @Column("uuid")
  challengeId: string

  @Column("text")
  submittedAnswer: string

  @Column({ type: "boolean" })
  isCorrect: boolean

  @Column({ type: "int", nullable: true })
  timeTaken: number // in seconds

  @Column({ type: "inet", nullable: true })
  ipAddress: string

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(
    () => User,
    (user) => user.submissions,
  )
  @JoinColumn({ name: "userId" })
  user: User

  @ManyToOne(
    () => Challenge,
    (challenge) => challenge.submissions,
  )
  @JoinColumn({ name: "challengeId" })
  challenge: Challenge
}
