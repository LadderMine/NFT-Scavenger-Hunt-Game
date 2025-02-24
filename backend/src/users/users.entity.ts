import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserProgress } from 'src/user-progress/user-progress.entity'; 
import { Scores } from 'src/scores/scores.entity'; // Import Scores

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

  // Add Scores relationship
  @OneToMany(() => Scores, (score) => score.user)
  scores: Scores[];
}
