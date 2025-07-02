import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

export enum MatchStatus {
  PENDING = "pending",
  ACTIVE = "active",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

@Entity("puzzle_matches")
export class Match {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "json" })
  playerIds: string[] // Array of user IDs

  @Column({ type: "json" })
  playerUsernames: string[] // Array of usernames

  @Column({
    type: "enum",
    enum: MatchStatus,
    default: MatchStatus.PENDING,
  })
  status: MatchStatus

  @Column({ type: "varchar", length: 50 })
  gameMode: string

  @Column({ type: "varchar", length: 20 })
  skillLevel: string

  @Column({ type: "int", default: 0 })
  averageWaitTime: number // Average wait time of matched players

  @CreateDateColumn()
  createdAt: Date

  @Column({ type: "timestamp", nullable: true })
  startedAt: Date

  @Column({ type: "timestamp", nullable: true })
  completedAt: Date
}
