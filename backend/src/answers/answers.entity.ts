import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Puzzles } from '../puzzles/puzzles.entity';

@Entity()
export class Answers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  text: string;

  @Column({ default: false })
  isCorrect: boolean;

  // Add other relevant fields like explanation, order, etc. if needed

  @ManyToOne(() => Puzzles, puzzle => puzzle.answers)
  puzzles: Puzzles;
} 