import { Injectable, type CanActivate, type ExecutionContext, HttpException, HttpStatus } from "@nestjs/common"
import type { RateLimitService } from "../services/rate-limit.service"

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private rateLimitService: RateLimitService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const userId = request.user?.id
    const challengeId = request.body?.challengeId

    if (!userId) {
      return true // Let auth guard handle authentication
    }

    const rateLimitResult = await this.rateLimitService.checkRateLimit(userId, challengeId)

    if (!rateLimitResult.allowed) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: rateLimitResult.message,
          remainingAttempts: rateLimitResult.remainingAttempts,
          resetTime: rateLimitResult.resetTime,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      )
    }

    return true
  }
}
