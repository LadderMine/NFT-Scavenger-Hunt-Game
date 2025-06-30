import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RewardClaim } from './reward-claim.entity';

export enum RewardType {
  NFT = 'nft',
  TOKEN = 'token',
  BADGE = 'badge',
  POINTS = 'points',
}

@Entity('rewards')
export class Reward {
  @ApiProperty({ description: 'Unique identifier for the reward' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Name of the reward' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'Description of the reward' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'Type of reward', enum: RewardType })
  @Column({ type: 'enum', enum: RewardType })
  type: RewardType;

  @ApiProperty({ description: 'Metadata for the reward (JSON string)' })
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @ApiProperty({ description: 'Challenge ID associated with this reward' })
  @Column({ type: 'varchar', length: 255 })
  challengeId: string;

  @ApiProperty({ description: 'Whether the reward is currently active' })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({
    description:
      'Maximum number of times this reward can be claimed (null for unlimited)',
  })
  @Column({ type: 'int', nullable: true })
  maxClaims: number | null;

  @ApiProperty({ description: 'Current number of claims for this reward' })
  @Column({ type: 'int', default: 0 })
  currentClaims: number;

  @ApiProperty({ description: 'Date when the reward was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Date when the reward was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RewardClaim, (claim) => claim.reward)
  claims: RewardClaim[];
}
