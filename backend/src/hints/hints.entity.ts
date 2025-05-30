import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Puzzles } from '../puzzles/puzzles.entity';

@Entity()
export class Hints {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ nullable: true })
  order?: number; // To order hints for a puzzle

  @ManyToOne(() => Puzzles, puzzle => puzzle.hints)
  puzzles: Puzzles;
}

