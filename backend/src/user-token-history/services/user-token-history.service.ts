import { Injectable, Logger, BadRequestException } from "@nestjs/common"
import type { Repository } from "typeorm"
import { TokenHistory, TokenType, TokenStatus } from "../entities/token-history.entity"
import type {
  CreateTokenHistoryDto,
  TokenHistoryResponse,
  TokenRevocationResult,
  TokenHistoryFilters,
  TokenHistoryStats,
  UserTokenSummary,
} from "../interfaces/token-history.interface"
import * as crypto from "crypto"
import type { JwtService } from "@nestjs/jwt"

@Injectable()
export class UserTokenHistoryService {
  private readonly logger = new Logger(UserTokenHistoryService.name)

  constructor(
    private readonly tokenHistoryRepository: Repository<TokenHistory>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Record a new token issuance
   */
  async recordTokenIssuance(tokenData: CreateTokenHistoryDto): Promise<TokenHistoryResponse> {
    this.logger.log(`Recording token issuance for user: ${tokenData.userId}`)

    try {
      // Generate token hash for security
      const tokenHash = this.generateTokenHash(tokenData.token)

      // Decode JWT to extract information
      const decodedToken = this.jwtService.decode(tokenData.token) as any

      const tokenHistory = this.tokenHistoryRepository.create({
        userId: tokenData.userId,
        tokenHash,
        jti: tokenData.jti || decodedToken?.jti || crypto.randomUUID(),
        tokenType: tokenData.tokenType || TokenType.ACCESS,
        status: TokenStatus.ACTIVE,
        issuedAt: tokenData.issuedAt || new Date(decodedToken?.iat * 1000) || new Date(),
        expiresAt: tokenData.expiresAt || new Date(decodedToken?.exp * 1000) || new Date(Date.now() + 3600000), // 1 hour default
        metadata: {
          ...tokenData.metadata,
          recordedAt: new Date().toISOString(),
        },
        issuer: tokenData.issuer || decodedToken?.iss || "default",
        scopes: tokenData.scopes || decodedToken?.scope?.split(" ") || [],
      })

      const savedToken = await this.tokenHistoryRepository.save(tokenHistory)

      this.logger.log(`Token recorded successfully: ${savedToken.id}`)

      return this.mapToResponse(savedToken)
    } catch (error) {
      this.logger.error(`Failed to record token: ${error.message}`)
      throw new BadRequestException(`Failed to record token: ${error.message}`)
    }
  }

  /**
   * Revoke a specific token
   */
  async revokeToken(tokenHash: string, revokedBy: string, reason?: string): Promise<TokenHistoryResponse | null> {
    this.logger.log(`Revoking token: ${tokenHash.substring(0, 8)}...`)

    const tokenHistory = await this.tokenHistoryRepository.findOne({
      where: { tokenHash, status: TokenStatus.ACTIVE },
    })

    if (!tokenHistory) {
      this.logger.warn(`Token not found or already revoked: ${tokenHash.substring(0, 8)}...`)
      return null
    }

    tokenHistory.status = TokenStatus.REVOKED
    tokenHistory.revokedAt = new Date()
    tokenHistory.revokedBy = revokedBy
    tokenHistory.revocationReason = reason || "Manual revocation"

    const updatedToken = await this.tokenHistoryRepository.save(tokenHistory)

    this.logger.log(`Token revoked successfully: ${updatedToken.id}`)

    return this.mapToResponse(updatedToken)
  }

  /**
   * Revoke all tokens for a user
   */
  async revokeAllUserTokens(
    userId: string,
    revokedBy: string,
    reason?: string,
    tokenType?: TokenType,
  ): Promise<TokenRevocationResult> {
    this.logger.log(`Revoking all tokens for user: ${userId}${tokenType ? ` (type: ${tokenType})` : ""}`)

    try {
      const queryBuilder = this.tokenHistoryRepository
        .createQueryBuilder("token")
        .where("token.userId = :userId", { userId })
        .andWhere("token.status = :status", { status: TokenStatus.ACTIVE })

      if (tokenType) {
        queryBuilder.andWhere("token.tokenType = :tokenType", { tokenType })
      }

      const activeTokens = await queryBuilder.getMany()

      if (activeTokens.length === 0) {
        return {
          success: true,
          revokedCount: 0,
          errors: [],
          revokedTokens: [],
        }
      }

      const revokedTokens: string[] = []
      const errors: string[] = []

      // Update all tokens in batch
      const updateResult = await this.tokenHistoryRepository
        .createQueryBuilder()
        .update(TokenHistory)
        .set({
          status: TokenStatus.REVOKED,
          revokedAt: new Date(),
          revokedBy,
          revocationReason: reason || "Bulk revocation",
        })
        .where("userId = :userId", { userId })
        .andWhere("status = :status", { status: TokenStatus.ACTIVE })
        .andWhere(tokenType ? "tokenType = :tokenType" : "1=1", tokenType ? { tokenType } : {})
        .execute()

      const revokedCount = updateResult.affected || 0

      activeTokens.forEach((token) => {
        revokedTokens.push(token.id)
      })

      this.logger.log(`Successfully revoked ${revokedCount} tokens for user: ${userId}`)

      return {
        success: true,
        revokedCount,
        errors,
        revokedTokens,
      }
    } catch (error) {
      this.logger.error(`Failed to revoke tokens for user ${userId}: ${error.message}`)
      return {
        success: false,
        revokedCount: 0,
        errors: [error.message],
        revokedTokens: [],
      }
    }
  }

  /**
   * Check if a token is valid (not revoked or expired)
   */
  async isTokenValid(token: string): Promise<boolean> {
    const tokenHash = this.generateTokenHash(token)

    const tokenHistory = await this.tokenHistoryRepository.findOne({
      where: { tokenHash },
    })

    if (!tokenHistory) {
      return false // Token not found in history
    }

    // Check if token is active and not expired
    const now = new Date()
    return tokenHistory.status === TokenStatus.ACTIVE && tokenHistory.expiresAt > now
  }

  /**
   * Get token history for a user
   */
  async getUserTokenHistory(
    userId: string,
    filters?: Omit<TokenHistoryFilters, "userId">,
    page = 1,
    limit = 50,
  ): Promise<{
    tokens: TokenHistoryResponse[]
    total: number
    page: number
    totalPages: number
  }> {
    this.logger.log(`Fetching token history for user: ${userId}`)

    const queryBuilder = this.tokenHistoryRepository
      .createQueryBuilder("token")
      .where("token.userId = :userId", { userId })

    // Apply filters
    if (filters?.tokenType) {
      queryBuilder.andWhere("token.tokenType = :tokenType", { tokenType: filters.tokenType })
    }

    if (filters?.status) {
      queryBuilder.andWhere("token.status = :status", { status: filters.status })
    }

    if (filters?.issuedAfter) {
      queryBuilder.andWhere("token.issuedAt >= :issuedAfter", { issuedAfter: filters.issuedAfter })
    }

    if (filters?.issuedBefore) {
      queryBuilder.andWhere("token.issuedAt <= :issuedBefore", { issuedBefore: filters.issuedBefore })
    }

    if (filters?.issuer) {
      queryBuilder.andWhere("token.issuer = :issuer", { issuer: filters.issuer })
    }

    if (filters?.ipAddress) {
      queryBuilder.andWhere("token.metadata->>'ipAddress' = :ipAddress", { ipAddress: filters.ipAddress })
    }

    if (filters?.sessionId) {
      queryBuilder.andWhere("token.metadata->>'sessionId' = :sessionId", { sessionId: filters.sessionId })
    }

    // Get total count
    const total = await queryBuilder.getCount()

    // Apply pagination and ordering
    const tokens = await queryBuilder
      .orderBy("token.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getMany()

    const totalPages = Math.ceil(total / limit)

    return {
      tokens: tokens.map((token) => this.mapToResponse(token)),
      total,
      page,
      totalPages,
    }
  }

  /**
   * Get comprehensive token statistics
   */
  async getTokenHistoryStats(): Promise<TokenHistoryStats> {
    this.logger.log("Calculating token history statistics")

    const [
      totalTokens,
      activeTokens,
      expiredTokens,
      revokedTokens,
      tokensByType,
      tokensByStatus,
      uniqueUsers,
      averageLifetime,
      recentActivity,
    ] = await Promise.all([
      // Total tokens
      this.tokenHistoryRepository.count(),

      // Active tokens
      this.tokenHistoryRepository.count({ where: { status: TokenStatus.ACTIVE } }),

      // Expired tokens
      this.tokenHistoryRepository.count({ where: { status: TokenStatus.EXPIRED } }),

      // Revoked tokens
      this.tokenHistoryRepository.count({ where: { status: TokenStatus.REVOKED } }),

      // Tokens by type
      this.tokenHistoryRepository
        .createQueryBuilder("token")
        .select("token.tokenType", "tokenType")
        .addSelect("COUNT(*)", "count")
        .groupBy("token.tokenType")
        .getRawMany(),

      // Tokens by status
      this.tokenHistoryRepository
        .createQueryBuilder("token")
        .select("token.status", "status")
        .addSelect("COUNT(*)", "count")
        .groupBy("token.status")
        .getRawMany(),

      // Unique users
      this.tokenHistoryRepository
        .createQueryBuilder("token")
        .select("COUNT(DISTINCT token.userId)", "count")
        .getRawOne(),

      // Average token lifetime
      this.tokenHistoryRepository
        .createQueryBuilder("token")
        .select("AVG(EXTRACT(EPOCH FROM (token.expiresAt - token.issuedAt)) / 3600)", "average")
        .getRawOne(),

      // Recent activity
      Promise.all([
        this.tokenHistoryRepository.count({
          where: {
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        }),
        this.tokenHistoryRepository.count({
          where: {
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        }),
        this.tokenHistoryRepository.count({
          where: {
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        }),
      ]),
    ])

    // Process results
    const typeDistribution = Object.values(TokenType).reduce(
      (acc, type) => {
        acc[type] = 0
        return acc
      },
      {} as Record<TokenType, number>,
    )

    tokensByType.forEach((item) => {
      typeDistribution[item.tokenType] = Number.parseInt(item.count)
    })

    const statusDistribution = Object.values(TokenStatus).reduce(
      (acc, status) => {
        acc[status] = 0
        return acc
      },
      {} as Record<TokenStatus, number>,
    )

    tokensByStatus.forEach((item) => {
      statusDistribution[item.status] = Number.parseInt(item.count)
    })

    return {
      totalTokens,
      activeTokens,
      expiredTokens,
      revokedTokens,
      tokensByType: typeDistribution,
      tokensByStatus: statusDistribution,
      uniqueUsers: Number.parseInt(uniqueUsers?.count || "0"),
      averageTokenLifetime: Number.parseFloat(averageLifetime?.average || "0"),
      recentActivity: {
        last24Hours: recentActivity[0],
        last7Days: recentActivity[1],
        last30Days: recentActivity[2],
      },
    }
  }

  /**
   * Get user token summary
   */
  async getUserTokenSummary(userId: string): Promise<UserTokenSummary> {
    this.logger.log(`Getting token summary for user: ${userId}`)

    const [totalTokens, activeTokens, lastToken, deviceInfo, sessionInfo, tokenTypes] = await Promise.all([
      // Total tokens for user
      this.tokenHistoryRepository.count({ where: { userId } }),

      // Active tokens for user
      this.tokenHistoryRepository.count({ where: { userId, status: TokenStatus.ACTIVE } }),

      // Last token issued
      this.tokenHistoryRepository.findOne({
        where: { userId },
        order: { createdAt: "DESC" },
      }),

      // Unique devices
      this.tokenHistoryRepository
        .createQueryBuilder("token")
        .select("COUNT(DISTINCT token.metadata->>'deviceInfo')", "count")
        .where("token.userId = :userId", { userId })
        .andWhere("token.metadata->>'deviceInfo' IS NOT NULL")
        .getRawOne(),

      // Unique sessions
      this.tokenHistoryRepository
        .createQueryBuilder("token")
        .select("COUNT(DISTINCT token.metadata->>'sessionId')", "count")
        .where("token.userId = :userId", { userId })
        .andWhere("token.metadata->>'sessionId' IS NOT NULL")
        .getRawOne(),

      // Token types used
      this.tokenHistoryRepository
        .createQueryBuilder("token")
        .select("DISTINCT token.tokenType", "tokenType")
        .where("token.userId = :userId", { userId })
        .getRawMany(),
    ])

    return {
      userId,
      totalTokens,
      activeTokens,
      lastTokenIssuedAt: lastToken?.createdAt,
      lastActivity: lastToken?.metadata?.lastUsedAt ? new Date(lastToken.metadata.lastUsedAt) : lastToken?.createdAt,
      deviceCount: Number.parseInt(deviceInfo?.count || "0"),
      sessionCount: Number.parseInt(sessionInfo?.count || "0"),
      tokenTypes: tokenTypes.map((t) => t.tokenType),
    }
  }

  /**
   * Clean up expired tokens
   */
  async cleanupExpiredTokens(): Promise<number> {
    this.logger.log("Cleaning up expired tokens")

    const now = new Date()

    // Update expired tokens that are still marked as active
    const updateResult = await this.tokenHistoryRepository
      .createQueryBuilder()
      .update(TokenHistory)
      .set({ status: TokenStatus.EXPIRED })
      .where("status = :activeStatus", { activeStatus: TokenStatus.ACTIVE })
      .andWhere("expiresAt < :now", { now })
      .execute()

    const updatedCount = updateResult.affected || 0

    this.logger.log(`Updated ${updatedCount} expired tokens`)

    return updatedCount
  }

  /**
   * Generate secure hash of token
   */
  private generateTokenHash(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex")
  }

  /**
   * Map entity to response DTO
   */
  private mapToResponse(tokenHistory: TokenHistory): TokenHistoryResponse {
    return {
      id: tokenHistory.id,
      userId: tokenHistory.userId,
      tokenHash: tokenHistory.tokenHash,
      jti: tokenHistory.jti,
      tokenType: tokenHistory.tokenType,
      status: tokenHistory.status,
      issuedAt: tokenHistory.issuedAt,
      expiresAt: tokenHistory.expiresAt,
      revokedAt: tokenHistory.revokedAt,
      revokedBy: tokenHistory.revokedBy,
      revocationReason: tokenHistory.revocationReason,
      metadata: tokenHistory.metadata,
      issuer: tokenHistory.issuer,
      scopes: tokenHistory.scopes,
      createdAt: tokenHistory.createdAt,
      updatedAt: tokenHistory.updatedAt,
    }
  }
}
