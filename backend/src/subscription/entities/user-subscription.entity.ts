import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Subscription } from './subscription.entity';

@Entity('user_subscriptions')
export class UserSubscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number; // Assuming user ID comes from an authentication system

  @ManyToOne(() => Subscription)
  subscription: Subscription;

  @CreateDateColumn()
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ default: 'pending' })
  paymentStatus: string; // "paid" or "pending"
}
