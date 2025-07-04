import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RateLimiterService } from './rate-limiter.service';

export const RATE_LIMIT_KEY = 'rate-limit';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rateLimiterService: RateLimiterService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const config = this.reflector.get<{ ttl: number; limit: number }>(
      RATE_LIMIT_KEY,
      context.getHandler(),
    );

    if (!config) return true;

    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.connection.remoteAddress;
    const key = `rate:${ip}:${context.getHandler().name}`;

    const isLimited = this.rateLimiterService.isRateLimited(
      key,
      config.ttl,
      config.limit,
    );

    if (isLimited) {
      throw new ForbiddenException(
        'Too many requests. Please try again later.',
      );
    }

    return true;
  }
}
