import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, Index } from "typeorm"
import { User } from "../../user/entities/user.entity" // Adjust path as needed
import { ReferralInvite } from "./referral-invite.entity"

export enum BonusType {
  REFERRAL_REWARD = "referral_reward",
  SIGNUP_BONUS = "signup_bonus",
  ACTION_BONUS = "action_bonus",
}

export enum BonusStatus {
  PENDING = "pending",
  PROCESSED = "processed",
  FAILED = "failed",
}

@Entity("referral_bonuses")
@Index(["userId"])
@Index(["referralInviteId"])
export class ReferralBonus {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid" })
  userId: string

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User

  @Column({ type: "uuid" })
  referralInviteId: string

  @ManyToOne(() => ReferralInvite, { onDelete: "CASCADE" })
  @JoinColumn({ name: "referralInviteId" })
  referralInvite: ReferralInvite

  @Column({
    type: "enum",
    enum: BonusType,
    default: BonusType.REFERRAL_REWARD,
  })
  type: BonusType

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number

  @Column({ type: "varchar", length: 10, default: "USD" })
  currency: string

  @Column({
    type: "enum",
    enum: BonusStatus,
    default: BonusStatus.PENDING,
  })
  status: BonusStatus

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ type: "timestamp", nullable: true })
  processedAt: Date

  @CreateDateColumn()
  createdAt: Date
}
