import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm"
import { Message } from "./message.entity"
import { User } from "../../users/entities/user.entity"
import { ConversationRole } from "./conversation-role.entity"
import { PinnedMessage } from "./pinned-message.entity"

export enum ConversationType {
  DIRECT = "direct",
  GROUP = "group",
  CHANNEL = "channel", // Public channel that users can join
  TEAM = "team", // Team-based chat for game teams
  GUILD = "guild", // Guild/clan chat
  GAME_LOBBY = "game_lobby", // Temporary chat for game lobbies
}

@Entity("conversations")
export class Conversation {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ nullable: true })
  name: string

  @Column({
    type: "enum",
    enum: ConversationType,
    default: ConversationType.DIRECT,
  })
  type: ConversationType

  @Column({ nullable: true })
  avatarUrl: string

  @Column({ default: false })
  isEncrypted: boolean

  @Column({ default: false })
  isPublic: boolean

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  topic: string

  @Column({ default: false })
  isModerated: boolean

  @Column({ default: 0 })
  maxParticipants: number

  @Column({ default: false })
  isTemporary: boolean

  @Column({ nullable: true })
  expiresAt: Date

  @Column({ default: false })
  allowsInvites: boolean

  @Column({ default: true })
  allowsReactions: boolean

  @Column({ default: true })
  allowsReplies: boolean

  @Column({ default: true })
  allowsForwarding: boolean

  @Column({ default: true })
  allowsMedia: boolean

  @Column({ default: false })
  isReadOnly: boolean

  @Column({ default: 0 })
  slowMode: number // Seconds between messages

  @ManyToMany(() => User, { cascade: true })
  @JoinTable({
    name: "conversation_participants",
    joinColumn: { name: "conversation_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "user_id", referencedColumnName: "id" },
  })
  participants: User[]

  @OneToMany(
    () => Message,
    (message) => message.conversation,
  )
  messages: Message[]

  @OneToMany(
    () => ConversationRole,
    (role) => role.conversation,
  )
  roles: ConversationRole[]

  @OneToMany(
    () => PinnedMessage,
    (pinned) => pinned.conversation,
  )
  pinnedMessages: PinnedMessage[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({ default: true })
  isActive: boolean

  @Column({ nullable: true })
  gameId: string // For game-related conversations

  @Column({ nullable: true })
  teamId: string // For team-based conversations

  @Column({ nullable: true })
  guildId: string // For guild-based conversations
}

