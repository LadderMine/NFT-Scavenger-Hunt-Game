import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from './user';

export enum AssetType {
  NFT = 'nft',
  BADGE = 'badge',
}

@Entity('inventory')
@Index(['userId', 'assetType'])
@Index(['userId', 'assetId', 'assetType'], { unique: true }) // Prevent duplicates
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  assetId: string; // FK to either NFT or Badge (resolved manually)

  @Column({
    type: 'enum',
    enum: AssetType,
  })
  assetType: AssetType;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  acquiredAt: Date;

  @Column('jsonb', { nullable: true })
  acquisitionContext: Record<string, any>; // How they got it (puzzle solved, etc.)

  @ManyToOne(() => User, user => user.inventory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
