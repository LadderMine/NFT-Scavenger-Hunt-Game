import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { Booster } from "./booster.entity"

@Entity("booster_bundles")
export class BoosterBundle {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column("text")
  description: string

  @Column("decimal", { precision: 10, scale: 2 })
  price: number

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  discountedPrice: number

  @ManyToOne(() => Booster)
  @JoinColumn({ name: "boosterId" })
  booster: Booster

  @Column()
  boosterId: string

  @Column("int")
  quantity: number

  @Column("boolean", { default: true })
  isActive: boolean

  @Column({ nullable: true })
  startsAt: Date

  @Column({ nullable: true })
  endsAt: Date

  @Column("int", { default: 0 })
  purchaseLimit: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

