import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { Affiliate } from "./affiliate.entity"

export enum ReferralStatus {
  PENDING = "pending",
  CONVERTED = "converted",
  EXPIRED = "expired",
}

@Entity("referrals")
export class Referral {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  referredUserId: string

  @Column({ nullable: true })
  conversionAmount: number

  @Column({
    type: "enum",
    enum: ReferralStatus,
    default: ReferralStatus.PENDING,
  })
  status: ReferralStatus

  @ManyToOne(
    () => Affiliate,
    (affiliate) => affiliate.referrals,
  )
  @JoinColumn({ name: "affiliateId" })
  affiliate: Affiliate

  @Column()
  affiliateId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

