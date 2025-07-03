import { Controller, Get, Query, Req, Res, HttpStatus } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import type { Response, Request } from 'express';

// Simple in-memory rate limiter
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 30; // 30 requests per window per IP
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }
  entry.count++;
  return false;
}

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  async getLeaderboard(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    if (rateLimit(ip as string)) {
      return res.status(HttpStatus.TOO_MANY_REQUESTS).json({ message: 'Rate limit exceeded' });
    }
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const sizeNum = Math.max(1, Math.min(100, parseInt(pageSize as string, 10) || 10));
    const { entries, total } = this.leaderboardService.getLeaderboard(pageNum, sizeNum);
    return res.status(HttpStatus.OK).json({
      data: entries,
      page: pageNum,
      pageSize: sizeNum,
      total,
    });
  }
} 