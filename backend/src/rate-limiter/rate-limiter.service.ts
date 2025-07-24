import { Injectable } from '@nestjs/common';

@Injectable()
export class RateLimiterService {
  private requestsMap = new Map<string, { count: number; expiresAt: number }>();

  isRateLimited(key: string, ttl: number, limit: number): boolean {
    const now = Date.now();
    const entry = this.requestsMap.get(key);

    if (!entry || now > entry.expiresAt) {
      this.requestsMap.set(key, { count: 1, expiresAt: now + ttl * 1000 });
      return false;
    }

    if (entry.count >= limit) return true;

    entry.count += 1;
    this.requestsMap.set(key, entry);
    return false;
  }
}
