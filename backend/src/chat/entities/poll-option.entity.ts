import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from "typeorm"
import { Poll } from "./poll.entity"
import { PollVote } from "./poll-vote.entity"

@Entity("poll_options")
export class PollOption {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  text: string

  @ManyToOne(
    () => Poll,
    (poll) => poll.options,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "poll_id" })
  poll: Poll

  @Column()
  pollId: string

  @CreateDateColumn()
  createdAt: Date

  @OneToMany(
    () => PollVote,
    (vote) => vote.option,
  )
  votes: PollVote[]
}

