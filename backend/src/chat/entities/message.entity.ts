import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm"
import { Conversation } from "./conversation.entity"
import { User } from "../../users/entities/user.entity"
import { MessageReceipt } from "./message-receipt.entity"
import { MessageReaction } from "./message-reaction.entity"
import { PinnedMessage } from "./pinned-message.entity"
import { Poll } from "./poll.entity"
import { GameInvite } from "./game-invite.entity"
import { SharedGameItem } from "./shared-game-item.entity"

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  FILE = "file",
  SYSTEM = "system",
  POLL = "poll",
  GAME_INVITE = "game_invite",
  GAME_ITEM = "game_item",
  ANNOUNCEMENT = "announcement",
}

export enum MessagePriority {
  NORMAL = "normal",
  HIGH = "high",
  URGENT = "urgent",
}

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "text" })
  content: string

  @Column({
    type: "enum",
    enum: MessageType,
    default: MessageType.TEXT,
  })
  type: MessageType

  @Column({
    type: "enum",
    enum: MessagePriority,
    default: MessagePriority.NORMAL,
  })
  priority: MessagePriority

  @Column({ nullable: true })
  mediaUrl: string

  @Column({ nullable: true })
  metadata: string // JSON string for additional metadata

  @ManyToOne(
    () => Conversation,
    (conversation) => conversation.messages,
  )
  @JoinColumn({ name: "conversation_id" })
  conversation: Conversation

  @Column()
  conversationId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "sender_id" })
  sender: User

  @Column()
  senderId: string

  @OneToMany(
    () => MessageReceipt,
    (receipt) => receipt.message,
  )
  receipts: MessageReceipt[]

  @OneToMany(
    () => MessageReaction,
    (reaction) => reaction.message,
  )
  reactions: MessageReaction[]

  @OneToMany(
    () => PinnedMessage,
    (pinned) => pinned.message,
  )
  pins: PinnedMessage[]

  @OneToMany(
    () => Poll,
    (poll) => poll.message,
  )
  polls: Poll[]

  @OneToMany(
    () => GameInvite,
    (invite) => invite.message,
  )
  gameInvites: GameInvite[]

  @OneToMany(
    () => SharedGameItem,
    (item) => item.message,
  )
  sharedGameItems: SharedGameItem[]

  @Column({ default: false })
  isEdited: boolean

  @Column({ nullable: true })
  editedAt: Date

  @Column({ default: false })
  isDeleted: boolean

  @Column({ default: false })
  isForwarded: boolean

  @Column({ nullable: true })
  forwardedFromId: string

  @Column({ default: false })
  isTranslated: boolean

  @Column({ nullable: true })
  originalLanguage: string

  @Column({ default: false })
  isMentioningEveryone: boolean

  @Column({ type: "simple-array", nullable: true })
  mentionedUserIds: string[]

  @Column({ default: false })
  isScheduled: boolean

  @Column({ nullable: true })
  scheduledFor: Date

  @Column({ default: false })
  isModerated: boolean

  @Column({ nullable: true })
  moderationReason: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({ nullable: true })
  replyToId: string

  @ManyToOne(() => Message, { nullable: true })
  @JoinColumn({ name: "reply_to_id" })
  replyTo: Message
}

