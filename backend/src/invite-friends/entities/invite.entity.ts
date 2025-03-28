import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { InviteStatus } from "../enums/invite-status.enum"

@Entity("invites")
export class Invite {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ nullable: true })
  emailOrPhone: string

  @Column({ unique: true })
  inviteToken: string

  @Column({
    type: "enum",
    enum: InviteStatus,
    default: InviteStatus.PENDING,
  })
  status: InviteStatus

  @CreateDateColumn()
  createdAt: Date

  @Column()
  expiresAt: Date

  @Column({ nullable: true })
  invitedById: string

  @UpdateDateColumn()
  updatedAt: Date
}

