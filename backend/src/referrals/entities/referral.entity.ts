import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ReferralConversion } from './referral-conversion.entity';
import { ReferralEarning } from './referral-earning.entity';

@Entity('referrals')
export class Referral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  referrerId: string;

  @Column('uuid')
  referredUserId: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ReferralConversion, conversion => conversion.referral)
  conversions: ReferralConversion[];

  @OneToMany(() => ReferralEarning, earning => earning.referral)
  earnings: ReferralEarning[];
} 