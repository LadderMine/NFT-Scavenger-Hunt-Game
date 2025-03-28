import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { Referral } from "./referral.entity"

@Entity("referral_codes")
export class ReferralCode {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  code: string

  @Column({ name: "user_id" })
  userId: string

  @Column({ default: true })
  active: boolean

  @Column({ nullable: true, name: "expires_at" })
  expiresAt: Date

  @OneToMany(
    () => Referral,
    (referral) => referral.referralCode,
  )
  referrals: Referral[]

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}

