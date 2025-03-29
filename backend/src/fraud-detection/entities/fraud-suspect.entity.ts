import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { FraudActivity } from "./fraud-activity.entity"

export enum FraudReviewStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  DISMISSED = "dismissed",
}

@Entity("fraud_suspects")
export class FraudSuspect {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ nullable: true })
  userId: string

  @Column()
  ipAddress: string

  @Column({ nullable: true })
  deviceFingerprint: string

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>

  @Column({
    type: "enum",
    enum: FraudReviewStatus,
    default: FraudReviewStatus.PENDING,
  })
  status: FraudReviewStatus

  @Column({ nullable: true })
  reviewedBy: string

  @Column({ nullable: true })
  reviewedAt: Date

  @Column({ nullable: true })
  reviewNotes: string

  @Column({ default: 0 })
  riskScore: number

  @OneToMany(
    () => FraudActivity,
    (activity) => activity.suspect,
  )
  activities: FraudActivity[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

