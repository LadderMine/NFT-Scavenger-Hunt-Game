import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Booster } from "./booster.entity"
import { User } from "../../users/entities/user.entity"

@Entity("booster_gifts")
export class BoosterGift {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "senderId" })
  sender: User

  @Column()
  senderId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "recipientId" })
  recipient: User

  @Column()
  recipientId: string

  @ManyToOne(() => Booster)
  @JoinColumn({ name: "boosterId" })
  booster: Booster

  @Column()
  boosterId: string

  @Column("int")
  quantity: number

  @Column("text", { nullable: true })
  message: string

  @Column("boolean", { default: false })
  isAccepted: boolean

  @Column({ nullable: true })
  acceptedAt: Date

  @CreateDateColumn()
  createdAt: Date
}

