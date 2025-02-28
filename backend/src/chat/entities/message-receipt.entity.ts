import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from "typeorm"
import { Message } from "./message.entity"
import { User } from "../../users/entities/user.entity"

export enum ReceiptStatus {
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
}

@Entity("message_receipts")
@Unique(["messageId", "userId"])
export class MessageReceipt {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(
    () => Message,
    (message) => message.receipts,
  )
  @JoinColumn({ name: "message_id" })
  message: Message

  @Column()
  messageId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User

  @Column()
  userId: string

  @Column({
    type: "enum",
    enum: ReceiptStatus,
    default: ReceiptStatus.SENT,
  })
  status: ReceiptStatus

  @CreateDateColumn()
  createdAt: Date

  @Column({ nullable: true })
  deliveredAt: Date

  @Column({ nullable: true })
  readAt: Date
}

