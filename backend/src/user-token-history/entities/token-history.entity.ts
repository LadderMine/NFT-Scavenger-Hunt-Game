import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

export enum TokenType {
  ACCESS = "access",
  REFRESH = "refresh",
  RESET_PASSWORD = "reset_password",
  EMAIL_VERIFICATION = "email_verification",
}

export enum TokenStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  REVOKED = "revoked",
  USED = "used",
}

@Entity("token_history")
@Index(["userId", "createdAt"])
@Index(["userId", "status"])
@Index(["tokenHash"])
@Index(["expiresAt"])
export class TokenHistory {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "uuid" })
  userId: string

  @Column({ type: "varchar", length: 64, unique: true })
  tokenHash: string // SHA-256 hash of the token for security

  @Column({ type: "varchar", length: 32, nullable: true })
  jti: string // JWT ID for tracking

  @Column({
    type: "enum",
    enum: TokenType,
    default: TokenType.ACCESS,
  })
  tokenType: TokenType

  @Column({
    type: "enum",
    enum: TokenStatus,
    default: TokenStatus.ACTIVE,
  })
  status: TokenStatus

  @Column({ type: "timestamp" })
  issuedAt: Date

  @Column({ type: "timestamp" })
  expiresAt: Date

  @Column({ type: "timestamp", nullable: true })
  revokedAt: Date

  @Column({ type: "varchar", length: 255, nullable: true })
  revokedBy: string // User ID or system identifier

  @Column({ type: "text", nullable: true })
  revocationReason: string

  @Column({ type: "json", nullable: true })
  metadata: {
    ipAddress?: string
    userAgent?: string
    deviceInfo?: string
    location?: string
    sessionId?: string
    refreshCount?: number
    lastUsedAt?: string
    [key: string]: any
  }

  @Column({ type: "varchar", length: 100, nullable: true })
  issuer: string // Service or application that issued the token

  @Column({ type: "simple-array", nullable: true })
  scopes: string[] // Token permissions/scopes

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
