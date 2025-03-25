import { Answers } from 'src/answers/answers.entity';
import { Hints } from 'src/hints/hints.entity';
import { Level } from 'src/level/entities/level.entity';
import { NFTs } from 'src/nfts/nfts.entity';
import { UserProgress } from 'src/user-progress/User-Progress.entity';
import { User } from 'src/users/users.entity';
import { Scores } from 'src/scores/scores.entity';
import { Answer } from 'src/answers/answers.entity';
import { 
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  OneToOne,
  BeforeInsert
} from 'typeorm';
import { Answers } from "src/answers/answers.entity";
import { Hints } from 'src/hints/hints.entity';
import { Level } from 'src/level/entities/level.entity';
import { NFTs } from 'src/nfts/nfts.entity';
import { Scores } from 'src/scores/scores.entity';
import { UserProgress } from 'src/user-progress/user-progress.entity';
import { LevelEnum } from 'src/enums/LevelEnum';

@Entity()
export class Puzzles {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ type: 'int' })
  pointValue: number;

  @OneToOne(() => NFTs, (nfts) => nfts.puzzles, { nullable: true })
  nfts: NFTs;

  @ManyToOne(() => UserProgress, (userProgress) => userProgress.puzzles)
  userProgress: UserProgress;

  @ManyToOne(() => Level, (level) => level.puzzles)
  level: Level;

  @Column({ type: 'enum', enum: LevelEnum })
  levelEnum: LevelEnum;

  @OneToMany(() => Scores, (score) => score.puzzle, { onDelete: 'SET NULL' }) 
  scores: Scores[];

  @OneToMany(() => Answers, (answer) => answer.puzzle)
  answers: Answers[];

  @BeforeInsert()
  async updateLevelCount() {
      if (this.level) {
          await Level.incrementCount(this.levelEnum);
      }
  }
}
