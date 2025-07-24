import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('geostats')
export class GeoStats {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ipAddress: string;

  @Column()
  country: string;

  @CreateDateColumn()
  timestamp: Date;
}