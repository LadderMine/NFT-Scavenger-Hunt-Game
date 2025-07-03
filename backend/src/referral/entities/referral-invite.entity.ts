import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from "typeorm"
import { User } from "../../user/entities/user.entity" // Adjust path as needed
import { ReferralCode } from "./referral-code.entity"

export enum InviteStatus {
  PENDING = "pending",
  REGISTERED = "registered",
  COMPLETED = "completed",
  EXPIRED = "expired",
}

@Entity("referral_invites")
@Index(["email"])
@Index(["referralCodeId"])
export class ReferralInvite {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid" })
  referralCodeId: string

  @ManyToOne(
    () => ReferralCode,
    (code) => code.invites,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "referralCodeId" })
  referralCode: ReferralCode

  @Column({ type: "varchar", length: 255 })
  email: string

  @Column({ type: "uuid", nullable: true })
  invitedUserId: string

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "invitedUserId" })
  invitedUser: User

  @Column({
    type: "enum",
    enum: InviteStatus,
    default: InviteStatus.PENDING,
  })
  status: InviteStatus

  @Column({ type: "timestamp", nullable: true })
  registeredAt: Date

  @Column({ type: "timestamp", nullable: true })
  completedAt: Date

  @Column({ type: "timestamp", nullable: true })
  expiresAt: Date

  @Column({ type: "text", nullable: true })
  metadata: string // JSON string for additional data

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
