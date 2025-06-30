import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('puzzle_completions')
@Index(['userId', 'puzzleId'], { unique: true })
export class PuzzleCompletion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  @Index()
  userId: string;

  @Column({ name: 'puzzle_id' })
  @Index()
  puzzleId: string;

  @Column({ name: 'completed_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  completedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
