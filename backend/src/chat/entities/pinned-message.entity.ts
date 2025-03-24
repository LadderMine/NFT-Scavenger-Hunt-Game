import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Column } from "typeorm"
import { Message } from "./message.entity"
import { User } from "../../users/entities/user.entity"
import { Conversation } from "./conversation.entity"

@Entity("pinned_messages")
export class PinnedMessage {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => Message, { onDelete: "CASCADE" })
  @JoinColumn({ name: "message_id" })
  message: Message

  @Column()
  messageId: string

  @ManyToOne(() => Conversation, { onDelete: "CASCADE" })
  @JoinColumn({ name: "conversation_id" })
  conversation: Conversation

  @Column()
  conversationId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "pinned_by_id" })
  pinnedBy: User

  @Column()
  pinnedById: string

  @CreateDateColumn()
  pinnedAt: Date
}

