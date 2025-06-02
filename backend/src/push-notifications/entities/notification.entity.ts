import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm"

export enum NotificationType {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
}

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid", nullable: true })
  userId: string | null

  @Column()
  title: string

  @Column("text")
  message: string

  @Column({
    type: "enum",
    enum: NotificationType,
    default: NotificationType.INFO,
  })
  type: NotificationType

  @Column({ default: false })
  isRead: boolean

  @CreateDateColumn()
  createdAt: Date
}

