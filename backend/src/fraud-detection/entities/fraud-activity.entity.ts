import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { FraudSuspect } from "./fraud-suspect.entity"

export enum FraudActivityType {
  DUPLICATE_ACCOUNT = "duplicate_account",
  SUSPICIOUS_REFERRAL = "suspicious_referral",
  IP_MISMATCH = "ip_mismatch",
  MULTIPLE_ACCOUNTS = "multiple_accounts",
  UNUSUAL_PATTERN = "unusual_pattern",
}

@Entity("fraud_activities")
export class FraudActivity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({
    type: "enum",
    enum: FraudActivityType,
  })
  type: FraudActivityType

  @Column({ type: "jsonb" })
  details: Record<string, any>

  @Column({ default: 0 })
  severityScore: number

  @ManyToOne(
    () => FraudSuspect,
    (suspect) => suspect.activities,
  )
  @JoinColumn({ name: "suspect_id" })
  suspect: FraudSuspect

  @Column()
  suspectId: string

  @CreateDateColumn()
  detectedAt: Date
}

