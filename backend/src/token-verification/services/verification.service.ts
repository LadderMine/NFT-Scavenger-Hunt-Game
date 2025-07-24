import { Injectable, Logger } from "@nestjs/common"
import type { JwtService } from "@nestjs/jwt"
import type { ConfigService } from "@nestjs/config"
import * as crypto from "crypto"
import { ethers } from "ethers"
import type {
  JwtPayload,
  WalletTokenPayload,
  TokenValidationResult,
  WalletVerificationOptions,
  JwtVerificationOptions,
} from "../interfaces/token.interface"

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name)

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Validates a JWT token
   */
  async validateJwtToken(token: string, options?: JwtVerificationOptions): Promise<TokenValidationResult> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        ignoreExpiration: options?.ignoreExpiration || false,
        audience: options?.audience,
        issuer: options?.issuer,
      })

      const expiresAt = payload.exp ? new Date(payload.exp * 1000) : undefined

      return {
        isValid: true,
        payload,
        expiresAt,
      }
    } catch (error) {
      this.logger.warn(`JWT validation failed: ${error.message}`)
      return {
        isValid: false,
        error: error.message,
      }
    }
  }

  /**
   * Validates a wallet signature token
   */
  async validateWalletToken(
    tokenData: WalletTokenPayload,
    options?: WalletVerificationOptions,
  ): Promise<TokenValidationResult> {
    try {
      const { address, signature, message, timestamp } = tokenData

      // Check timestamp if maxAge is specified
      if (options?.maxAge) {
        const now = Date.now()
        if (now - timestamp > options.maxAge) {
          return {
            isValid: false,
            error: "Token has expired",
          }
        }
      }

      // Check required message if specified
      if (options?.requiredMessage && message !== options.requiredMessage) {
        return {
          isValid: false,
          error: "Invalid message",
        }
      }

      // Verify the signature
      const recoveredAddress = ethers.utils.verifyMessage(message, signature)

      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        return {
          isValid: false,
          error: "Invalid signature",
        }
      }

      const expiresAt = options?.maxAge ? new Date(timestamp + options.maxAge) : undefined

      return {
        isValid: true,
        payload: tokenData,
        expiresAt,
      }
    } catch (error) {
      this.logger.warn(`Wallet token validation failed: ${error.message}`)
      return {
        isValid: false,
        error: error.message,
      }
    }
  }

  /**
   * Extracts token from Authorization header
   */
  extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader) return null

    const [type, token] = authHeader.split(" ")
    return type === "Bearer" ? token : null
  }

  /**
   * Generates a nonce for wallet authentication
   */
  generateNonce(): string {
    return crypto.randomBytes(32).toString("hex")
  }

  /**
   * Creates a standard message for wallet signing
   */
  createWalletMessage(address: string, nonce: string, timestamp?: number): string {
    const ts = timestamp || Date.now()
    return `Please sign this message to authenticate with your wallet.\n\nAddress: ${address}\nNonce: ${nonce}\nTimestamp: ${ts}`
  }

  /**
   * Validates token format (basic checks)
   */
  isValidTokenFormat(token: string): boolean {
    if (!token || typeof token !== "string") return false

    // Basic JWT format check (3 parts separated by dots)
    const parts = token.split(".")
    return parts.length === 3
  }
}
