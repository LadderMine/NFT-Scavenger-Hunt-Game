import { Module, DynamicModule } from '@nestjs/common';
import { RateLimiterService } from './rate-limiter.service';
import { RateLimitGuard } from './rate-limit.guard';

@Module({})
export class RateLimiterModule {
  static forRoot(): DynamicModule {
    return {
      module: RateLimiterModule,
      providers: [RateLimiterService, RateLimitGuard],
      exports: [RateLimiterService, RateLimitGuard],
    };
  }
}
