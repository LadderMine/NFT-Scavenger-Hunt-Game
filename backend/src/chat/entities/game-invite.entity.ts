import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Message } from "./message.entity"
import { User } from "../../users/entities/user.entity"

export enum GameInviteStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
  EXPIRED = "expired",
}

@Entity("game_invites")
export class GameInvite {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  gameId: string

  @Column()
  gameMode: string

  @Column({ nullable: true })
  serverRegion: string

  @ManyToOne(() => Message, { onDelete: "CASCADE" })
  @JoinColumn({ name: "message_id" })
  message: Message

  @Column()
  messageId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "sender_id" })
  sender: User

  @Column()
  senderId: string

  @Column({
    type: "enum",
    enum: GameInviteStatus,
    default: GameInviteStatus.PENDING,
  })
  status: GameInviteStatus

  @Column({ nullable: true })
  expiresAt: Date

  @CreateDateColumn()
  createdAt: Date

  @Column({ nullable: true })
  respondedAt: Date
}

