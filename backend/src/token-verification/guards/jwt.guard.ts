import { Injectable, type CanActivate, type ExecutionContext, UnauthorizedException, Logger } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import type { VerificationService } from "../services/verification.service"
import type { JwtVerificationOptions } from "../interfaces/token.interface"

export const JWT_OPTIONS_KEY = "jwt_options"
export const JwtOptions = (options: JwtVerificationOptions) =>
  Reflector.createDecorator<JwtVerificationOptions>({ key: JWT_OPTIONS_KEY, value: options })

@Injectable()
export class JwtGuard implements CanActivate {
  private readonly logger = new Logger(JwtGuard.name)

  constructor(
    private readonly verificationService: VerificationService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    if (!authHeader) {
      throw new UnauthorizedException("Authorization header is missing")
    }

    const token = this.verificationService.extractTokenFromHeader(authHeader)
    if (!token) {
      throw new UnauthorizedException("Invalid authorization header format")
    }

    // Get JWT options from decorator if present
    const options = this.reflector.getAllAndOverride<JwtVerificationOptions>(JWT_OPTIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const validationResult = await this.verificationService.validateJwtToken(token, options)

    if (!validationResult.isValid) {
      this.logger.warn(`JWT validation failed: ${validationResult.error}`)
      throw new UnauthorizedException("Invalid or expired token")
    }

    // Attach the payload to the request for use in controllers
    request.tokenPayload = validationResult.payload
    request.tokenExpiresAt = validationResult.expiresAt

    return true
  }
}
