/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserProgress } from '../user-progress/UserProgress.entity';
import { Scores } from 'src/scores/scores.entity';
import { Puzzles } from 'src/puzzles/puzzles.entity';
import { NFTs } from 'src/nfts/nfts.entity';
import { Hints } from 'src/hints/hints.entity';

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

  @OneToMany(() => UserProgress, (userProgress) => userProgress.user, {
    cascade: true,
    eager: true,
  })
  userProgress: UserProgress[];

  @OneToMany(() => Scores, (score) => score.user, { cascade: true })
  scores: Scores[];

  @OneToMany(() => Puzzles, (puzzle) => puzzle.user, { cascade: true })
  puzzles: Puzzles[];

  @OneToMany(() => NFTs, (nft) => nft.user, { cascade: true })
  nfts: NFTs[];

  @OneToMany(() => Hints, (hint) => hint.user, { cascade: true })
  hints: Hints[];
}
