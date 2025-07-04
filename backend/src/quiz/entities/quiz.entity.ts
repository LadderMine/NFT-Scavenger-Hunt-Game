import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuizQuestion } from './quiz-question.entity';

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 100, nullable: true })
  topic: string;

  @Column({ type: 'int', default: 60 })
  timeLimit: number; // in minutes

  @Column({ type: 'int', default: 0 })
  passingScore: number; // percentage

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  randomizeQuestions: boolean;

  @Column({ default: false })
  randomizeOptions: boolean;

  @OneToMany(() => QuizQuestion, (question) => question.quiz, { cascade: true })
  questions: QuizQuestion[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
