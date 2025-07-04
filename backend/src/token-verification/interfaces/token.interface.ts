export interface JwtPayload {
  sub: string
  iat?: number
  exp?: number
  [key: string]: any
}

export interface WalletTokenPayload {
  address: string
  signature: string
  message: string
  timestamp: number
  [key: string]: any
}

export interface TokenValidationResult {
  isValid: boolean
  payload?: JwtPayload | WalletTokenPayload
  error?: string
  expiresAt?: Date
}

export interface WalletVerificationOptions {
  maxAge?: number // Maximum age in milliseconds
  requiredMessage?: string
}

export interface JwtVerificationOptions {
  ignoreExpiration?: boolean
  audience?: string
  issuer?: string
}
