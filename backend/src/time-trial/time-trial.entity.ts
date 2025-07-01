import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity("time_trials")
export class TimeTrial {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("uuid")
  @Index()
  userId: string

  @Column("uuid")
  @Index()
  puzzleId: string

  @Column({ type: "timestamp" })
  startTime: Date

  @Column({ type: "timestamp", nullable: true })
  endTime: Date

  @Column({ default: false })
  completed: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

}
