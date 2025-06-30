import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Inventory } from './inventory'; 

@Entity('nfts')
export class NFT {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  imageUrl: string;

  @Column()
  rarity: string; // Common, Rare, Epic, Legendary

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Inventory, inventory => inventory.nft)
  inventoryItems: Inventory[];

  @CreateDateColumn()
  createdAt: Date;
}