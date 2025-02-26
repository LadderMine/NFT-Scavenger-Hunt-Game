/* eslint-disable prettier/prettier */
import { Leaderboard } from 'src/leaderboard/entities/leaderboard.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Scores } from 'src/scores/scores.entity'; // Import Scores
import { Answer } from 'src/answers/answers.entity';
import { Rank } from 'src/rank/entities/rank.entity';
import { UserProgress } from 'src/user-progress/user-progress.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Rank, (rank) => rank.userId, { eager: true, cascade: true })
  rank: Rank;

  @OneToMany(() => UserProgress, (userProgress) => userProgress.user)
  userProgress: UserProgress[];

  @OneToMany(() => Leaderboard, (leaderboard) => leaderboard.user)
  leaderboardEntries: Leaderboard[];
  // Add Scores relationship
  @OneToMany(() => Scores, (score) => score.user)
  scores: Scores[];

  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];
}
