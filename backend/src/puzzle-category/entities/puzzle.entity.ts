import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('puzzles')
export class Puzzle {
  @ApiProperty({ description: 'Unique identifier for the puzzle' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Title of the puzzle' })
  @Column({ length: 200 })
  title: string;

  @ApiProperty({ description: 'Description of the puzzle' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'Difficulty level of the puzzle' })
  @Column({ 
    type: 'enum', 
    enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'],
    default: 'BEGINNER'
  })
  difficulty: string;

  @ApiProperty({ description: 'Points awarded for completing the puzzle' })
  @Column({ default: 10 })
  points: number;

  @ApiProperty({ description: 'Whether the puzzle is active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Estimated time to complete in minutes' })
  @Column({ default: 15 })
  estimatedTime: number;

  @ApiProperty({ description: 'Date when the puzzle was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Date when the puzzle was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Many-to-many relationship with Category entity
  @ManyToMany(() => Category, category => category.puzzles)
  categories: Category[];
}

// Import the Category entity
import { Category } from './category.entity'; 