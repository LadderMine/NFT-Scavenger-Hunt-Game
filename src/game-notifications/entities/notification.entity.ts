import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm"
import { User } from "./user.entity"
import { GameEvent } from "./game-event.entity"

export enum NotificationStatus {
  UNREAD = "unread",
  READ = "read",
  DISMISSED = "dismissed",
}

@Entity("notifications")
@Index(["userId", "status"])
@Index(["createdAt"])
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  title: string

  @Column("text")
  message: string

  @Column({
    type: "enum",
    enum: NotificationStatus,
    default: NotificationStatus.UNREAD,
  })
  status: NotificationStatus

  @Column("jsonb", { nullable: true })
  data: Record<string, any>

  @Column("uuid")
  userId: string

  @ManyToOne(
    () => User,
    (user) => user.notifications,
  )
  @JoinColumn({ name: "userId" })
  user: User

  @Column("uuid", { nullable: true })
  gameEventId: string

  @ManyToOne(() => GameEvent)
  @JoinColumn({ name: "gameEventId" })
  gameEvent: GameEvent

  @Column({ nullable: true })
  readAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
