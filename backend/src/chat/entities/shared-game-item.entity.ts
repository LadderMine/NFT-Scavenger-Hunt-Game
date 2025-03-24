import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Message } from "./message.entity"
import { User } from "../../users/entities/user.entity"

@Entity("shared_game_items")
export class SharedGameItem {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  itemId: string

  @Column()
  itemType: string

  @Column()
  itemName: string

  @Column({ nullable: true })
  itemRarity: string

  @Column({ nullable: true })
  itemImageUrl: string

  @Column({ type: "json", nullable: true })
  itemAttributes: Record<string, any>

  @ManyToOne(() => Message, { onDelete: "CASCADE" })
  @JoinColumn({ name: "message_id" })
  message: Message

  @Column()
  messageId: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "shared_by_id" })
  sharedBy: User

  @Column()
  sharedById: string

  @CreateDateColumn()
  createdAt: Date
}

