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

export enum PayoutStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}

@Entity("payouts")
export class Payout {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  amount: number

  @Column({
    type: "enum",
    enum: PayoutStatus,
    default: PayoutStatus.PENDING,
  })
  status: PayoutStatus

  @Column({ nullable: true })
  paymentReference: string

  @Column({ nullable: true })
  paymentMethod: string

  @ManyToOne(
    () => Affiliate,
    (affiliate) => affiliate.payouts,
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

