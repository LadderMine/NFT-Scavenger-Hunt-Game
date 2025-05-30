import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Puzzles } from '../puzzles/puzzles.entity';

@Entity()
export class DailyPuzzle {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Puzzles)
  puzzle: Puzzles;

  @CreateDateColumn()
  date: Date;

  @Column({ default: true })
  isActive: boolean;
}
