import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, Index } from 'typeorm';
import { Puzzle } from '../../puzzle/puzzle.entity';

@Entity('puzzle_translations')
@Unique(['puzzle', 'language'])
export class PuzzleTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Puzzle, { onDelete: 'CASCADE' })
  puzzle: Puzzle;

  @Column()
  @Index()
  language: string; // e.g., 'en', 'es', 'fr'

  @Column('text')
  title: string;

  @Column('text')
  description: string;
} 