import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  action: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ type: 'json', nullable: true })
  meta: Record<string, any>;
}
