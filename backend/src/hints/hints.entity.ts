import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany, OneToOne,
} from 'typeorm';
import { Puzzles } from 'src/puzzles/puzzles.entity';
import { UserProgress } from '../user-progress/user-progress.entity';
import { Answer } from 'src/answers/answers.entity';

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}
import { User } from "src/users/users.entity"
import { Answers } from "src/answers/answers.entity"
@Entity()
export class Hints {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Puzzles, (puzzles) => puzzles.hints, { onDelete: 'CASCADE' })
  puzzles: Puzzles;

  @OneToMany(() => UserProgress, (userProgress) => userProgress.hints)
  userProgress: UserProgress[];

  @Column()
  hintText: string;

  @Column({ type: 'enum', enum: DifficultyLevel, nullable: true })
  difficultyLevel?: DifficultyLevel;

  @OneToMany(() => Answer, (answer) => answer.hint, { nullable: true })
  answers: Answer[];
}
