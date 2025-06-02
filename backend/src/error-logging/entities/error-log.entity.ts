/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum ErrorLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

@Entity('error_logs')
export class ErrorLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  message: string;

  @Column({ type: 'text', nullable: true })
  stackTrace: string;

  @Column()
  @Index()
  context: string;

  @Column({
    type: 'enum',
    enum: ErrorLevel,
    default: ErrorLevel.ERROR,
  })
  @Index()
  level: ErrorLevel;

  @CreateDateColumn()
  @Index()
  timestamp: Date;
} 