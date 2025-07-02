import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { ApiProperty } from "@nestjs/swagger"

@Entity("categories")
export class Category {
  @ApiProperty({ description: "Unique identifier for the category" })
  @PrimaryGeneratedColumn("uuid") // Changed to UUID for consistency
  id: string

  @ApiProperty({ description: "Name of the category" })
  @Column({ unique: true, length: 100 })
  name: string

  @ApiProperty({ description: "Description of the category" })
  @Column({ type: "text", nullable: true })
  description: string

  @ApiProperty({ description: "Slug for URL-friendly category names" })
  @Column({ unique: true, length: 100 })
  slug: string

  @ApiProperty({ description: "Icon or emoji for the category" })
  @Column({ length: 10, nullable: true })
  icon: string

  @ApiProperty({ description: "Color code for the category" })
  @Column({ length: 7, nullable: true })
  color: string

  @ApiProperty({ description: "Whether the category is active" })
  @Column({ default: true })
  isActive: boolean

  @ApiProperty({ description: "Order for sorting categories" })
  @Column({ default: 0 })
  sortOrder: number

  @ApiProperty({ description: "Date when the category was created" })
  @CreateDateColumn()
  createdAt: Date

  @ApiProperty({ description: "Date when the category was last updated" })
  @UpdateDateColumn()
  updatedAt: Date

  // Many-to-many relationship with CategoryPuzzle entity
  @ManyToMany(
    () => CategoryPuzzle,
    (puzzle) => puzzle.categories,
  )
  @JoinTable({
    name: "puzzle_categories",
    joinColumn: {
      name: "category_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "puzzle_id",
      referencedColumnName: "id",
    },
  })
  puzzles: CategoryPuzzle[]
}

// Import the CategoryPuzzle entity
import { CategoryPuzzle } from "../entities/puzzle.entity"
