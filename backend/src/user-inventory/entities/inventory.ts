import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Index } from 'typeorm';
import { User } from './user';
import { NFT } from './nft';
import { Badge } from './badge';

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
  assetId: string;

  @Column({
    type: 'enum',
    enum: AssetType,
  })
  assetType: AssetType;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  acquiredAt: Date;

  @Column('jsonb', { nullable: true })
  acquisitionContext: Record<string, any>; // How they got it (puzzle solved, achievement unlocked, etc.)

  @ManyToOne(() => User, user => user.inventory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => NFT, nft => nft.inventoryItems, { nullable: true })
  @JoinColumn({ name: 'assetId' })
  nft: NFT;

  @ManyToOne(() => Badge, badge => badge.inventoryItems, { nullable: true })
  @JoinColumn({ name: 'assetId' })
  badge: Badge;

  @CreateDateColumn()
  createdAt: Date;
}
