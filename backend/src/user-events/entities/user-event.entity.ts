import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm"
import { User } from "../../users/users.entity"
import { EventType } from "../enums/event-type.enum"

@Entity("user_events")
@Index(["userId", "eventType"])
@Index(["eventType", "createdAt"])
@Index(["userId", "createdAt"])
export class UserEvent {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ name: "user_id", nullable: true })
  userId: string

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User

  @Column({
    type: "enum",
    enum: EventType,
    name: "event_type",
  })
  eventType: EventType

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>

  @Column({ name: "ip_address", nullable: true })
  ipAddress: string

  @Column({ name: "user_agent", nullable: true })
  userAgent: string

  @Column({ name: "session_id", nullable: true })
  sessionId: string

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}
