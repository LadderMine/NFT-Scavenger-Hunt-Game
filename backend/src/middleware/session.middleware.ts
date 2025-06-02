import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  private sessionMiddleware: any;

  constructor(private redisService: RedisService) {
    const RedisStore = connectRedis(session);
    
    this.sessionMiddleware = session({
      store: new RedisStore({
        client: this.redisService.getClient() as any,
        prefix: 'sess:',
        ttl: 86400, // 24 hours in seconds
      }),
      secret: process.env.SESSION_SECRET || 'your-super-secret-key-change-in-production',
      resave: false,
      saveUninitialized: false,
      name: 'sessionId',
      cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        sameSite: 'strict',
      },
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.sessionMiddleware(req, res, next);
  }
}
