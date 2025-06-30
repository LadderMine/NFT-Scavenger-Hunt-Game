import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Inventory } from './inventory';

@Entity('badges')
export class Badge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  achievementType: string; // puzzle_solver, speed_runner, explorer, etc.

  @Column()
  iconUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Inventory, inventory => inventory.badge)
  inventoryItems: Inventory[];

  @CreateDateColumn()
  createdAt: Date;
}