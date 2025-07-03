import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Reward } from './reward.entity';

@Entity('reward_claims')
@Index(['userId', 'rewardId'], { unique: true })
export class RewardClaim {
  @ApiProperty({ description: 'Unique identifier for the reward claim' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User ID who claimed the reward' })
  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @ApiProperty({ description: 'Reward ID that was claimed' })
  @Column({ type: 'uuid' })
  rewardId: string;

  @ApiProperty({ description: 'Challenge ID associated with the claim' })
  @Column({ type: 'varchar', length: 255 })
  challengeId: string;

  @ApiProperty({ description: 'Date when the reward was claimed' })
  @CreateDateColumn()
  claimDate: Date;

  @ApiProperty({ description: 'Transaction hash if applicable' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  transactionHash: string | null;

  @ApiProperty({ description: 'Status of the claim' })
  @Column({ type: 'varchar', length: 50, default: 'claimed' })
  status: string;

  @ManyToOne(() => Reward, (reward) => reward.claims)
  @JoinColumn({ name: 'rewardId' })
  reward: Reward;
} 