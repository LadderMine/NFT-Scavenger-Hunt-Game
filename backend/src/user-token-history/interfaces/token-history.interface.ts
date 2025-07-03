import type { TokenType, TokenStatus } from "../entities/token-history.entity"

export interface CreateTokenHistoryDto {
  userId: string
  token: string
  tokenType?: TokenType
  issuedAt?: Date
  expiresAt?: Date
  metadata?: TokenMetadata
  issuer?: string
  scopes?: string[]
  jti?: string
}

export interface TokenMetadata {
  ipAddress?: string
  userAgent?: string
  deviceInfo?: string
  location?: string
  sessionId?: string
  refreshCount?: number
  lastUsedAt?: string
  [key: string]: any
}

export interface TokenHistoryResponse {
  id: string
  userId: string
  tokenHash: string
  jti?: string
  tokenType: TokenType
  status: TokenStatus
  issuedAt: Date
  expiresAt: Date
  revokedAt?: Date
  revokedBy?: string
  revocationReason?: string
  metadata?: TokenMetadata
  issuer?: string
  scopes?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface TokenRevocationResult {
  success: boolean
  revokedCount: number
  errors: string[]
  revokedTokens: string[]
}

export interface TokenHistoryFilters {
  userId?: string
  tokenType?: TokenType
  status?: TokenStatus
  issuedAfter?: Date
  issuedBefore?: Date
  expiresAfter?: Date
  expiresBefore?: Date
  issuer?: string
  ipAddress?: string
  sessionId?: string
}

export interface TokenHistoryStats {
  totalTokens: number
  activeTokens: number
  expiredTokens: number
  revokedTokens: number
  tokensByType: Record<TokenType, number>
  tokensByStatus: Record<TokenStatus, number>
  uniqueUsers: number
  averageTokenLifetime: number // in hours
  recentActivity: {
    last24Hours: number
    last7Days: number
    last30Days: number
  }
}

export interface UserTokenSummary {
  userId: string
  totalTokens: number
  activeTokens: number
  lastTokenIssuedAt?: Date
  lastActivity?: Date
  deviceCount: number
  sessionCount: number
  tokenTypes: TokenType[]
}
