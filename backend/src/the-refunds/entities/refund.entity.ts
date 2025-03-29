import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

export enum RefundStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DECLINED = "DECLINED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

@Entity("refunds")
export class Refund {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid" })
  userId: string

  @Column({ type: "uuid" })
  orderId: string

  @Column({ type: "text" })
  reason: string

  @Column({
    type: "enum",
    enum: RefundStatus,
    default: RefundStatus.PENDING,
  })
  status: RefundStatus

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  amount: number

  @Column({ type: "text", nullable: true })
  adminNotes: string

  @Column({ type: "uuid", nullable: true })
  processedBy: string

  @Column({ type: "timestamp", nullable: true })
  processedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

