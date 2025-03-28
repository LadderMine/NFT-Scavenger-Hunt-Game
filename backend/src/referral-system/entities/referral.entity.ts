import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { ReferralCode } from "./referral-code.entity"

export enum ReferralStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  REWARDED = "rewarded",
  CANCELLED = "cancelled",
}

@Entity("referrals")
export class Referral {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ name: "referrer_id" })
  referrerId: string

  @Column({ name: "referred_id" })
  referredId: string

  @Column({
    type: "enum",
    enum: ReferralStatus,
    default: ReferralStatus.PENDING,
  })
  status: ReferralStatus

  @Column({ name: "referral_code_id" })
  referralCodeId: string

  @ManyToOne(
    () => ReferralCode,
    (referralCode) => referralCode.referrals,
  )
  @JoinColumn({ name: "referral_code_id" })
  referralCode: ReferralCode

  @Column({ nullable: true, name: "completed_at" })
  completedAt: Date

  @Column({ nullable: true, name: "rewarded_at" })
  rewardedAt: Date

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}

