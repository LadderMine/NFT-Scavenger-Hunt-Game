import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity("maintenance_config")
export class MaintenanceConfig {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "boolean", default: false })
  isMaintenanceMode: boolean

  @Column({ type: "text", nullable: true })
  maintenanceMessage: string

  @Column({ type: "timestamp", nullable: true })
  scheduledStart: Date

  @Column({ type: "timestamp", nullable: true })
  scheduledEnd: Date

  @Column({ type: "uuid", nullable: true })
  enabledBy: string // Admin user ID who enabled maintenance

  @Column({ type: "varchar", length: 100, nullable: true })
  enabledByUsername: string

  @Column({ type: "text", nullable: true })
  reason: string

  @Column({ type: "json", nullable: true })
  allowedRoutes: string[] // Routes that should remain accessible during maintenance

  @Column({ type: "json", nullable: true })
  allowedUserIds: string[] // Specific users allowed during maintenance

  @Column({ type: "boolean", default: true })
  blockApiRoutes: boolean

  @Column({ type: "boolean", default: true })
  blockWebRoutes: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
