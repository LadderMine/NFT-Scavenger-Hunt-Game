import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('puzzle_dependencies')
@Index(['puzzleId', 'dependsOnPuzzleId'], { unique: true })
export class PuzzleDependency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'puzzle_id' })
  @Index()
  puzzleId: string;

  @Column({ name: 'depends_on_puzzle_id' })
  @Index()
  dependsOnPuzzleId: string;

  @Column({ default: true })
  isRequired: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}