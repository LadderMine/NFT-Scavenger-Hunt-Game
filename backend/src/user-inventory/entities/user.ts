import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Inventory } from './inventory';
import { TimeTrial } from 'src/time-trial/time-trial.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
  
  // @OneToMany(() => TimeTrial, timeTrial => timeTrial.user)
  // timeTrials: TimeTrial[];

  @OneToMany(() => Inventory, inventory => inventory.user)
  inventory: Inventory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}