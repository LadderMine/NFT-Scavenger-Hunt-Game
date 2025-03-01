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
import { TranslationKey } from "./translation-key.entity"

@Entity("translations")
@Index(["languageId", "translationKeyId"], { unique: true })
export class Translation {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid" })
  languageId: string

  @ManyToOne(
    () => Language,
    (language) => language.translations,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "languageId" })
  language: Language

  @Column({ type: "uuid" })
  translationKeyId: string

  @ManyToOne(
    () => TranslationKey,
    (key) => key.translations,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "translationKeyId" })
  translationKey: TranslationKey

  @Column({ type: "text" })
  value: string

  @Column({ default: false })
  isApproved: boolean

  @Column({ nullable: true, type: "uuid" })
  approvedBy: string

  @Column({ nullable: true })
  approvedAt: Date

  @Column({ nullable: true, type: "uuid" })
  createdBy: string

  @Column({ nullable: true, type: "uuid" })
  updatedBy: string

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

