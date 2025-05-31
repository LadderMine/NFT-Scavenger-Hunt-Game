import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip: string;

  @Column()
  country: string;

  @Column()
  region: string;

  @Column()
  city: string;

  @Column()
  userId: number;

  @CreateDateColumn()
  timestamp: Date;
}
