import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  duration: string; // e.g., "monthly", "yearly"

  @Column({ default: true })
  isActive: boolean;
}
