import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Unique } from "typeorm"
import { PollOption } from "./poll-option.entity"
import { User } from "../../users/entities/user.entity"
import { Poll } from "./poll.entity"

@Entity("poll_votes")
@Unique(["pollId", "userId", "optionId"])
export class PollVote {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => Poll, { onDelete: "CASCADE" })
  @JoinColumn({ name: "poll_id" })
  poll: Poll

  @ManyToOne(
    () => PollOption,
    (option) => option.votes,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "option_id" })
  option: PollOption

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User

  @CreateDateColumn()
  createdAt: Date

  // Foreign keys
  @PrimaryGeneratedColumn("uuid")
  pollId: string

  @PrimaryGeneratedColumn("uuid")
  optionId: string

  @PrimaryGeneratedColumn("uuid")
  userId: string
}

