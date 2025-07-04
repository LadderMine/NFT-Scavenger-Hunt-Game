import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from "typeorm"
import { User } from "../../user/entities/user.entity" // Adjust path as needed
import { ReferralInvite } from "./referral-invite.entity"

@Entity("referral_codes")
@Index(["code"], { unique: true })
export class ReferralCode {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "varchar", length: 20, unique: true })
  code: string

  @Column({ type: "uuid" })
  userId: string

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User

  @Column({ type: "int", default: 0 })
  totalInvites: number

  @Column({ type: "int", default: 0 })
  successfulInvites: number

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  totalBonusEarned: number

  @Column({ type: "boolean", default: true })
  isActive: boolean

  @Column({ type: "timestamp", nullable: true })
  expiresAt: Date

  @OneToMany(
    () => ReferralInvite,
    (invite) => invite.referralCode,
  )
  invites: ReferralInvite[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
