/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  eventType: string;

  @Column({ nullable: true })
  @Index()
  userId: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  resource: string;

  @Column({ nullable: true })
  resourceId: string;

  @Column({ nullable: true })
  action: string;

  @Column({ nullable: true })
  status: string;

  @CreateDateColumn()
  @Index()
  timestamp: Date;
}
