import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Translation } from "./translation.entity"

@Entity("translation_keys")
export class TranslationKey {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ length: 255, unique: true })
  key: string

  @Column({ length: 100 })
  category: string // UI, Puzzle, Hint, etc.

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ type: "text", nullable: true })
  defaultValue: string

  @Column({ default: true })
  isActive: boolean

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>

  @OneToMany(
    () => Translation,
    (translation) => translation.translationKey,
  )
  translations: Translation[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

