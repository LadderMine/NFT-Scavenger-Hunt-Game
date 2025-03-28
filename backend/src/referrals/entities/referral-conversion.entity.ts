import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Referral } from './referral.entity';

@Entity('referral_conversions')
export class ReferralConversion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  referralId: string;

  @Column()
  conversionType: string;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Referral, (referral) => referral.conversions)
  referral: Referral;
}
