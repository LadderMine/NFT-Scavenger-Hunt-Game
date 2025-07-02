import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./user.entity"
import { Challenge } from "./challenge.entity"

@Entity("hint_usages")
export class HintUsage {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("uuid")
  userId: string

  @Column("uuid")
  challengeId: string

  @Column({ type: "int" })
  hintIndex: number

  @Column("text")
  hintContent: string

  @CreateDateColumn()
  usedAt: Date

  @ManyToOne(
    () => User,
    (user) => user.hintUsages,
  )
  @JoinColumn({ name: "userId" })
  user: User

  @ManyToOne(
    () => Challenge,
    (challenge) => challenge.hintUsages,
  )
  @JoinColumn({ name: "challengeId" })
  challenge: Challenge
}
