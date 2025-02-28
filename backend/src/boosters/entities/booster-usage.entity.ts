import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Index } from "typeorm"
import { Booster } from "./booster.entity"
import { User } from "../../users/entities/user.entity"

@Entity("booster_usages")
@Index(["userId", "createdAt"])
export class BoosterUsage {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User

  @Column()
  userId: string

  @ManyToOne(() => Booster)
  @JoinColumn({ name: "boosterId" })
  booster: Booster

  @Column()
  boosterId: string

  @Column({ nullable: true })
  puzzleId: string

  @Column("jsonb", { nullable: true })
  metadata: Record<string, any>

  @Column("boolean", { default: true })
  wasSuccessful: boolean

  @Column({ nullable: true })
  effectiveUntil: Date

  @Column("text", { nullable: true })
  result: string

  @CreateDateColumn()
  createdAt: Date
}

