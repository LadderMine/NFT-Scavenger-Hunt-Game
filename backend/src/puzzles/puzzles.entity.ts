import { Answers } from 'src/answers/answers.entity';
import { Hints } from 'src/hints/hints.entity';
import { Level } from 'src/level/entities/level.entity';
import { NFTs } from 'src/nfts/nfts.entity';
import { UserProgress } from 'src/user-progress/User-Progress.entity';
import { Scores } from 'src/scores/scores.entity';
import { 
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  OneToOne,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { LevelEnum } from 'src/enums/LevelEnum';

@Entity()
export class Puzzles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  title: string;

  // --- Versioning Fields ---
  @Column({ type: 'int', default: 1 })
  version: number;

  @Index() 
  @Column({ type: 'int', nullable: true })
  originalPuzzleId: number | null; 

  @ManyToOne(() => Puzzles, { nullable: true, createForeignKeyConstraints: false })
  originalPuzzle: Puzzles | null;

  @OneToMany(() => Puzzles, puzzle => puzzle.originalPuzzle)
  versions: Puzzles[];

  @Index() 
  @Column({ type: 'boolean', default: true })
  isLatest: boolean;
  // --- End Versioning Fields ---

  @OneToMany(() => Hints, (hints) => hints.puzzles)
  hints: Hints[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date; // Soft delete column

  @Column({ type: 'int' })
  pointValue: number;

  @OneToOne(() => NFTs, (nfts) => nfts.puzzles, { nullable: true })
  nfts: NFTs;

  @ManyToOne(() => Level, (level) => level.puzzles)
  level: Level;

  @Column({ type: 'enum', enum: LevelEnum })
  levelEnum: LevelEnum;

  @OneToMany(() => Scores, (score) => score.puzzle, { onDelete: 'SET NULL' }) 
  scores: Scores[];

  @OneToMany(() => Answers, (answer) => answer.puzzles)
  answers: Answers[];
}
