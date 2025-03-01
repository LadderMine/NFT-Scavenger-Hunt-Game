import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Translation } from "./translation.entity"
import { UserLanguagePreference } from "./user-language-preference.entity"
import { PuzzleTranslation } from "./puzzle-translation.entity"

@Entity("languages")
export class Language {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ length: 10, unique: true })
  code: string // e.g., 'en', 'es', 'fr'

  @Column({ length: 100 })
  name: string // e.g., 'English', 'Spanish', 'French'

  @Column({ length: 100, nullable: true })
  nativeName: string // e.g., 'English', 'Español', 'Français'

  @Column({ default: false })
  isDefault: boolean

  @Column({ default: true })
  isActive: boolean

  @Column({ nullable: true })
  flagIcon: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ default: 0 })
  sortOrder: number

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>

  @OneToMany(
    () => Translation,
    (translation) => translation.language,
  )
  translations: Translation[]

  @OneToMany(
    () => UserLanguagePreference,
    (preference) => preference.language,
  )
  userPreferences: UserLanguagePreference[]

  @OneToMany(
    () => PuzzleTranslation,
    (puzzleTranslation) => puzzleTranslation.language,
  )
  puzzleTranslations: PuzzleTranslation[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

