import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

export enum ArticleStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

@Entity("articles")
export class Article {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ length: 255 })
  title: string

  @Column({ type: "text" })
  content: string

  @Column({ name: "author_id" })
  authorId: string

  @Column({
    type: "enum",
    enum: ArticleStatus,
    default: ArticleStatus.DRAFT,
  })
  status: ArticleStatus

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}

