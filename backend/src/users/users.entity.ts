/* eslint-disable prettier/prettier */
import { Leaderboard } from 'src/leaderboard/entities/leaderboard.entity';
import { UserProgress } from 'src/user-progress/userprogress.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
 // Ensure this is correctly imported

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

  @OneToMany(() => UserProgress, (userProgress) => userProgress.user)
  userProgress: UserProgress[];

  @OneToMany(() => Leaderboard, (leaderboard) => leaderboard.user)
leaderboardEntries: Leaderboard[];
}
