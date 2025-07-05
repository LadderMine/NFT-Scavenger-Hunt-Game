import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('forked_puzzles')
export class ForkedPuzzle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // The ID of the original puzzle this was forked from
  @Index()
  @Column()
  originalPuzzleId: string;

  // The version number of the original puzzle at the time of forking
  @Column()
  forkedFromVersion: number;

  @Column()
  title: string;

  // Store the full content of the puzzle at the time of the fork
  @Column({ type: 'jsonb' })
  content: Record<string, any>;

  @CreateDateColumn()
  forkedAt: Date;
}