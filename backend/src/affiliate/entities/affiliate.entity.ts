import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { Referral } from "./referral.entity"
import { Payout } from "./payout.entity"

@Entity("affiliates")
export class Affiliate {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  userId: string

  @Column({ unique: true })
  referralCode: string

  @Column({ default: 0 })
  totalEarnings: number

  @Column({ default: 0 })
  availableBalance: number

  @Column({ default: true })
  isActive: boolean

  @OneToMany(
    () => Referral,
    (referral) => referral.affiliate,
  )
  referrals: Referral[]

  @OneToMany(
    () => Payout,
    (payout) => payout.affiliate,
  )
  payouts: Payout[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

