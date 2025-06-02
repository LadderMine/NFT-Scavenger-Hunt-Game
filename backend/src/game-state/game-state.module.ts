import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GameStateService } from './game-state.service';
import { GameStateController } from './game-state.controller';
import { PuzzlesModule } from '../puzzles/puzzles.module';
import { HintsModule } from '../hints/hints.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.get('REDIS_URL') || 'redis://localhost:6379',
        options: {
          retryDelayOnFailover: 100,
          enableReadyCheck: true,
          maxRetriesPerRequest: 3,
          lazyConnect: true,
          keepAlive: 30000,
          connectTimeout: 10000,
          commandTimeout: 5000,
        },
      }),
    }),
    PuzzlesModule,
    HintsModule,
    UsersModule,
  ],
  controllers: [GameStateController],
  providers: [GameStateService],
  exports: [GameStateService],
})
export class GameStateModule {}