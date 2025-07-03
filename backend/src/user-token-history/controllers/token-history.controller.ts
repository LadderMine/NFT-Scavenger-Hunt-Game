import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  UseGuards,
  Req,
  Logger,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth, ApiBody } from "@nestjs/swagger"
import type { Request } from "express"
import type { UserTokenHistoryService } from "../services/user-token-history.service"
import { AdminGuard } from "../guards/admin.guard"
import { TokenType, TokenStatus } from "../entities/token-history.entity"
import type {
  CreateTokenHistoryDto,
  TokenHistoryResponse,
  TokenRevocationResult,
  TokenHistoryStats,
  UserTokenSummary,
} from "../interfaces/token-history.interface"

@ApiTags("Token History")
@Controller("token-history")
export class TokenHistoryController {
  private readonly logger = new Logger(TokenHistoryController.name)

  constructor(private readonly tokenHistoryService: UserTokenHistoryService) {}

  @Post("record")
  @ApiOperation({
    summary: "Record token issuance",
    description: "Record a new token issuance in the history",
  })
  @ApiBody({
    schema: {
      type: "object",
      required: ["userId", "token"],
      properties: {
        userId: { type: "string", format: "uuid" },
        token: { type: "string" },
        tokenType: { type: "string", enum: Object.values(TokenType) },
        metadata: {
          type: "object",
          properties: {
            ipAddress: { type: "string" },
            userAgent: { type: "string" },
            deviceInfo: { type: "string" },
            sessionId: { type: "string" },
          },
        },
        issuer: { type: "string" },
        scopes: { type: "array", items: { type: "string" } },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Token recorded successfully",
  })
  async recordToken(tokenData: CreateTokenHistoryDto): Promise<{
    success: boolean
    message: string
    data: TokenHistoryResponse
  }> {
    this.logger.log(`Recording token for user: ${tokenData.userId}`)

    const result = await this.tokenHistoryService.recordTokenIssuance(tokenData)

    return {
      success: true,
      message: "Token recorded successfully",
      data: result,
    }
  }

  @Put("revoke/:tokenHash")
  @ApiOperation({
    summary: "Revoke specific token",
    description: "Revoke a specific token by its hash",
  })
  @ApiParam({
    name: "tokenHash",
    description: "SHA-256 hash of the token to revoke",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        reason: { type: "string", description: "Reason for revocation" },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Token revoked successfully",
  })
  async revokeToken(
    tokenHash: string,
    body: { reason?: string },
    @Req() request: Request,
  ): Promise<{
    success: boolean
    message: string
    data?: TokenHistoryResponse
  }> {
    this.logger.log(`Revoking token: ${tokenHash.substring(0, 8)}...`)

    const user = (request as any).user
    const revokedBy = user?.id || "system"

    const result = await this.tokenHistoryService.revokeToken(tokenHash, revokedBy, body.reason)

    if (!result) {
      return {
        success: false,
        message: "Token not found or already revoked",
      }
    }

    return {
      success: true,
      message: "Token revoked successfully",
      data: result,
    }
  }

  @Put("revoke-all/:userId")
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Revoke all user tokens (Admin only)",
    description: "Revoke all active tokens for a specific user",
  })
  @ApiParam({
    name: "userId",
    description: "User ID to revoke tokens for",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        reason: { type: "string", description: "Reason for revocation" },
        tokenType: { type: "string", enum: Object.values(TokenType), description: "Optional token type filter" },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Tokens revoked successfully",
  })
  async revokeAllUserTokens(
    @Param("userId", ParseUUIDPipe) userId: string,
    body: { reason?: string; tokenType?: TokenType },
    @Req() request: Request,
  ): Promise<{
    success: boolean
    message: string
    data: TokenRevocationResult
  }> {
    this.logger.log(`Revoking all tokens for user: ${userId}`)

    const user = (request as any).user
    const revokedBy = user?.id || "admin"

    const result = await this.tokenHistoryService.revokeAllUserTokens(userId, revokedBy, body.reason, body.tokenType)

    return {
      success: result.success,
      message: `${result.revokedCount} tokens revoked successfully`,
      data: result,
    }
  }

  @Get("user/:userId")
  @ApiOperation({
    summary: "Get user token history",
    description: "Retrieve token history for a specific user",
  })
  @ApiParam({
    name: "userId",
    description: "User ID to get token history for",
  })
  @ApiQuery({ name: "page", required: false, type: Number, description: "Page number (default: 1)" })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Items per page (default: 50)" })
  @ApiQuery({ name: "tokenType", required: false, enum: TokenType, description: "Filter by token type" })
  @ApiQuery({ name: "status", required: false, enum: TokenStatus, description: "Filter by token status" })
  @ApiQuery({ name: "issuer", required: false, type: String, description: "Filter by issuer" })
  @ApiResponse({
    status: 200,
    description: "Token history retrieved successfully",
  })
  async getUserTokenHistory(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query("tokenType") tokenType?: TokenType,
    @Query("status") status?: TokenStatus,
    @Query("issuer") issuer?: string,
  ) {
    this.logger.log(`Fetching token history for user: ${userId}`)

    const filters = {}
    if (tokenType) filters["tokenType"] = tokenType
    if (status) filters["status"] = status
    if (issuer) filters["issuer"] = issuer

    const result = await this.tokenHistoryService.getUserTokenHistory(userId, filters, page, limit)

    return {
      success: true,
      message: "Token history retrieved successfully",
      data: result,
    }
  }

  @Get("user/:userId/summary")
  @ApiOperation({
    summary: "Get user token summary",
    description: "Get a summary of token usage for a specific user",
  })
  @ApiParam({
    name: "userId",
    description: "User ID to get summary for",
  })
  @ApiResponse({
    status: 200,
    description: "User token summary retrieved successfully",
  })
  async getUserTokenSummary(@Param("userId", ParseUUIDPipe) userId: string): Promise<{
    success: boolean
    message: string
    data: UserTokenSummary
  }> {
    this.logger.log(`Getting token summary for user: ${userId}`)

    const summary = await this.tokenHistoryService.getUserTokenSummary(userId)

    return {
      success: true,
      message: "User token summary retrieved successfully",
      data: summary,
    }
  }

  @Get("stats")
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get token history statistics (Admin only)",
    description: "Retrieve comprehensive token history statistics",
  })
  @ApiResponse({
    status: 200,
    description: "Statistics retrieved successfully",
  })
  async getTokenHistoryStats(): Promise<{
    success: boolean
    message: string
    data: TokenHistoryStats
  }> {
    this.logger.log("Fetching token history statistics")

    const stats = await this.tokenHistoryService.getTokenHistoryStats()

    return {
      success: true,
      message: "Statistics retrieved successfully",
      data: stats,
    }
  }

  @Post("validate")
  @ApiOperation({
    summary: "Validate token",
    description: "Check if a token is valid (not revoked or expired)",
  })
  @ApiBody({
    schema: {
      type: "object",
      required: ["token"],
      properties: {
        token: { type: "string", description: "JWT token to validate" },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Token validation result",
  })
  async validateToken(body: { token: string }): Promise<{
    success: boolean
    message: string
    data: { isValid: boolean }
  }> {
    this.logger.log("Validating token")

    const isValid = await this.tokenHistoryService.isTokenValid(body.token)

    return {
      success: true,
      message: "Token validation completed",
      data: { isValid },
    }
  }

  @Post("cleanup")
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Cleanup expired tokens (Admin only)",
    description: "Update status of expired tokens and return count of updated records",
  })
  @ApiResponse({
    status: 200,
    description: "Cleanup completed successfully",
  })
  async cleanupExpiredTokens(): Promise<{
    success: boolean
    message: string
    data: { updatedCount: number }
  }> {
    this.logger.log("Starting token cleanup")

    const updatedCount = await this.tokenHistoryService.cleanupExpiredTokens()

    return {
      success: true,
      message: `Cleanup completed: ${updatedCount} tokens updated`,
      data: { updatedCount },
    }
  }
}
