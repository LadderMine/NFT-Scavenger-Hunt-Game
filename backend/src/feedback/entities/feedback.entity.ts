import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsNumber, Min, Max, Length } from 'class-validator';

@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  @IsNotEmpty()
  userId: string;

  @Column({ name: 'challenge_id' })
  @IsNotEmpty()
  challengeId: string;

  @Column({ type: 'int' })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @Column({ type: 'text' })
  @IsNotEmpty()
  @Length(10, 1000, {
    message: 'Comment must be between 10 and 1000 characters',
  })
  comment: string;

  @CreateDateColumn({ name: 'created_at' })
  timestamp: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
