import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsOptional, IsEnum, IsUUID, IsObject, IsArray, IsDateString } from "class-validator"
import { TokenType } from "../entities/token-history.entity"

export class CreateTokenHistoryDto {
  @ApiProperty({
    description: "User ID who owns the token",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  userId: string

  @ApiProperty({
    description: "JWT token string",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  @IsString()
  token: string

  @ApiProperty({
    description: "Type of token",
    enum: TokenType,
    required: false,
    default: TokenType.ACCESS,
  })
  @IsOptional()
  @IsEnum(TokenType)
  tokenType?: TokenType

  @ApiProperty({
    description: "Token issuance timestamp",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  issuedAt?: Date

  @ApiProperty({
    description: "Token expiration timestamp",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: Date

  @ApiProperty({
    description: "Token metadata (IP, device info, etc.)",
    required: false,
    example: {
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0...",
      deviceInfo: "iPhone 12 Pro",
      sessionId: "sess_123456",
    },
  })
  @IsOptional()
  @IsObject()
  metadata?: {
    ipAddress?: string
    userAgent?: string
    deviceInfo?: string
    location?: string
    sessionId?: string
    [key: string]: any
  }

  @ApiProperty({
    description: "Token issuer",
    required: false,
    example: "auth-service",
  })
  @IsOptional()
  @IsString()
  issuer?: string

  @ApiProperty({
    description: "Token scopes/permissions",
    required: false,
    example: ["read", "write", "admin"],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  scopes?: string[]

  @ApiProperty({
    description: "JWT ID for tracking",
    required: false,
  })
  @IsOptional()
  @IsString()
  jti?: string
}

export class RevokeTokenDto {
  @ApiProperty({
    description: "Reason for token revocation",
    required: false,
    example: "User logout",
  })
  @IsOptional()
  @IsString()
  reason?: string
}

export class RevokeAllTokensDto {
  @ApiProperty({
    description: "Reason for bulk token revocation",
    required: false,
    example: "Password reset",
  })
  @IsOptional()
  @IsString()
  reason?: string

  @ApiProperty({
    description: "Optional token type filter",
    enum: TokenType,
    required: false,
  })
  @IsOptional()
  @IsEnum(TokenType)
  tokenType?: TokenType
}

export class ValidateTokenDto {
  @ApiProperty({
    description: "JWT token to validate",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  @IsString()
  token: string
}
