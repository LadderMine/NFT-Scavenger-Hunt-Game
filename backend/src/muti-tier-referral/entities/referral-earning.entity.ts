import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm"
import { Referral } from "./referral.entity"

@Entity("referral_earnings")
export class ReferralEarning {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ name: "referral_id", type: "uuid" })
  @Index()
  referralId: string

  @ManyToOne(() => Referral)
  @JoinColumn({ name: "referral_id" })
  referral: Referral

  @Column({ name: "user_id", type: "uuid" })
  @Index()
  userId: string

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number

  @Column({ type: "int" })
  tier: number

  @Column({ type: "decimal", precision: 5, scale: 2 })
  percentage: number

  @Column({ name: "transaction_id", type: "uuid", nullable: true })
  transactionId: string

  @Column({ type: "varchar", length: 255, nullable: true })
  description: string

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date
}

