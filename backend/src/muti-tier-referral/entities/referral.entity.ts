import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm"

@Entity("referrals")
export class Referral {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ name: "referrer_id", type: "uuid" })
  @Index()
  referrerId: string

  @Column({ name: "referee_id", type: "uuid", unique: true })
  @Index()
  refereeId: string

  @Column({ type: "varchar", length: 100, unique: true })
  @Index()
  code: string

  @Column({ type: "boolean", default: false })
  activated: boolean

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date

  // Self-referencing relationship to support multi-tier referrals
  @ManyToOne(
    () => Referral,
    (referral) => referral.childReferrals,
    { nullable: true },
  )
  @JoinColumn({ name: "parent_referral_id" })
  parentReferral: Referral

  @Column({ name: "parent_referral_id", type: "uuid", nullable: true })
  parentReferralId: string

  @OneToMany(
    () => Referral,
    (referral) => referral.parentReferral,
  )
  childReferrals: Referral[]

  // Tier level in the referral chain (1, 2, 3, etc.)
  @Column({ type: "int", default: 1 })
  tier: number
}

