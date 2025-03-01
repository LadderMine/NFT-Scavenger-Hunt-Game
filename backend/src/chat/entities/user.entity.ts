import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  username: string

  @Column()
  displayName: string

  @Column({ nullable: true })
  avatarUrl: string

  @Column({ default: true })
  isOnline: boolean

  @Column({ nullable: true })
  lastSeen: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

