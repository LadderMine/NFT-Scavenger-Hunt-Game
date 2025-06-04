import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { GameEvent } from "./game-event.entity"
import { Notification } from "./notification.entity"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  username: string

  @Column({ unique: true })
  email: string

  @Column({ default: true })
  isActive: boolean

  @Column({ default: true })
  notificationsEnabled: boolean

  @OneToMany(
    () => GameEvent,
    (gameEvent) => gameEvent.user,
  )
  gameEvents: GameEvent[]

  @OneToMany(
    () => Notification,
    (notification) => notification.user,
  )
  notifications: Notification[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
