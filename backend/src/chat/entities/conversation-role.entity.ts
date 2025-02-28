import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Unique } from "typeorm"
import { Conversation } from "./conversation.entity"
import { User } from "../../users/entities/user.entity"

export enum ConversationRoleType {
  OWNER = "owner",
  ADMIN = "admin",
  MODERATOR = "moderator",
  MEMBER = "member",
}

@Entity("conversation_roles")
@Unique(["conversationId", "userId"])
export class ConversationRole {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => Conversation, { onDelete: "CASCADE" })
  @JoinColumn({ name: "conversation_id" })
  conversation: Conversation

  @Column()
  conversationId: string

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User

  @Column()
  userId: string

  @Column({
    type: "enum",
    enum: ConversationRoleType,
    default: ConversationRoleType.MEMBER,
  })
  role: ConversationRoleType

  @CreateDateColumn()
  createdAt: Date
}

