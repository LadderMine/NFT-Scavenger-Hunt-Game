import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('puzzle_versions')
@Index(['puzzleId', 'version'], { unique: true })
export class PuzzleVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  
  @Column()
  puzzleId: string;

  @Column()
  version: number;

  @Column()
  title: string;

  
  @Column({ type: 'jsonb' })
  content: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}