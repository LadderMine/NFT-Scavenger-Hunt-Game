import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Unique } from "typeorm"
import { Message } from "./message.entity"
import { User } from "../../users/entities/user.entity"

@Entity("message_reactions")
@Unique(["messageId", "userId", "reaction"])
export class MessageReaction {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => Message, { onDelete: "CASCADE" })
  @JoinColumn({ name: "message_id" })
  message: Message

  @Column()
  messageId: string

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User

  @Column()
  userId: string

  @Column()
  reaction: string

  @CreateDateColumn()
  createdAt: Date
}

