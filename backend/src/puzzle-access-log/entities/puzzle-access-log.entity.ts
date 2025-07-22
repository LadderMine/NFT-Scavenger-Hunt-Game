import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('puzzle_access_logs')
export class PuzzleAccessLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index() // Index for faster user-specific queries
  @Column()
  userId: string;

  @Index() // Index for faster puzzle-specific queries
  @Column()
  puzzleId: string;

  @CreateDateColumn()
  accessTimestamp: Date;
}