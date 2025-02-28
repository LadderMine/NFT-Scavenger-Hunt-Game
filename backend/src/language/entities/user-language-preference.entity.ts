import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm"
import { Language } from "./language.entity"

@Entity("user_language_preferences")
@Index(["userId"], { unique: true })
export class UserLanguagePreference {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid" })
  userId: string

  @Column({ type: "uuid" })
  languageId: string

  @ManyToOne(
    () => Language,
    (language) => language.userPreferences,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "languageId" })
  language: Language

  @Column({ default: false })
  autoDetected: boolean

  @Column({ type: "jsonb", nullable: true })
  additionalPreferences: Record<string, any>

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

