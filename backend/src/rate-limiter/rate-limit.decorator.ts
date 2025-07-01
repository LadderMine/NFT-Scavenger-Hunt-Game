import { SetMetadata } from '@nestjs/common';
import { RATE_LIMIT_KEY } from './rate-limit.guard';

export const RateLimit = (config: { ttl: number; limit: number }) =>
  SetMetadata(RATE_LIMIT_KEY, config);
