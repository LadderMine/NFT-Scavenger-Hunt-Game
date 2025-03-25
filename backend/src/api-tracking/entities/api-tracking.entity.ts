import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('api_tracking')
export class ApiTracking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index() 
  method: string;

  @Column()
  url: string;

  @Column()
  @Index() 
  statusCode: number;

  @Column()
  responseTime: number;

  @CreateDateColumn({ type: 'timestamp' })
  @Index() 
  timestamp: Date;
}
