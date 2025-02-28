import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm"

@Entity("notifications")
@Index(["userId", "isRead"])
@Index(["userId", "createdAt"])
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  userId: string

  @Column()
  title: string

  @Column("text")
  message: string

  @Column()
  type: string

  @Column("jsonb", { nullable: true })
  metadata: Record<string, any>

  @Column("boolean", { default: false })
  isRead: boolean

  @Column({ nullable: true })
  readAt: Date

  @CreateDateColumn()
  createdAt: Date
}

