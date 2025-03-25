import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from "typeorm"
import { Message } from "./message.entity"
import { User } from "../../users/entities/user.entity"
import { PollOption } from "./poll-option.entity"

@Entity("polls")
export class Poll {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  question: string

  @ManyToOne(() => Message, { onDelete: "CASCADE" })
  @JoinColumn({ name: "message_id" })
  message: Message

  @Column()
  messageId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by_id" })
  createdBy: User

  @Column()
  createdById: string

  @Column({ default: false })
  isMultipleChoice: boolean

  @Column({ default: false })
  isAnonymous: boolean

  @Column({ nullable: true })
  expiresAt: Date

  @Column({ default: false })
  isClosed: boolean

  @CreateDateColumn()
  createdAt: Date

  @OneToMany(
    () => PollOption,
    (option) => option.poll,
    { cascade: true },
  )
  options: PollOption[]
}

