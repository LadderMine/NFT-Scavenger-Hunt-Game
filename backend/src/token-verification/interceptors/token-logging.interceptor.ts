import { Injectable, type NestInterceptor, type ExecutionContext, type CallHandler, Logger } from "@nestjs/common"
import type { Observable } from "rxjs"
import { tap } from "rxjs/operators"
import type { VerificationService } from "../services/verification.service"

@Injectable()
export class TokenLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TokenLoggingInterceptor.name)

  constructor(private readonly verificationService: VerificationService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    if (authHeader) {
      const token = this.verificationService.extractTokenFromHeader(authHeader)
      if (token) {
        // Log token usage (without exposing the actual token)
        const tokenHash = this.hashToken(token)
        this.logger.log(`Token used: ${tokenHash} for ${request.method} ${request.url}`)
      }
    }

    return next.handle().pipe(
      tap(() => {
        // Log successful token verification
        if (request.tokenPayload) {
          this.logger.log(`Token verification successful for user: ${request.tokenPayload.sub || "unknown"}`)
        }
        if (request.walletPayload) {
          this.logger.log(`Wallet verification successful for address: ${request.walletPayload.address}`)
        }
      }),
    )
  }

  private hashToken(token: string): string {
    // Create a simple hash for logging purposes (first 8 chars of token)
    return token.substring(0, 8) + "..."
  }
}
