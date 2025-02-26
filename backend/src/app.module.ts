import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

// Application modules
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PuzzlesModule } from './puzzles/puzzles.module';
import { NftsModule } from './nfts/nfts.module';
import { ScoresModule } from './scores/scores.module';
import { AnswersModule } from './answers/answers.module';
import { HintsModule } from './hints/hints.module';
import { UserProgressModule } from './user-progress/user-progress.module';
import { AuthModule } from './auth/auth.module';
import { LevelModule } from './level/level.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

// Config and JWT configuration
import appConfig from 'config/app.config';
import databaseConfig from 'config/database.config';
import jwtConfig from './auth/config/jwt.config';

// Global authentication guard
import { AuthTokenGuard } from './auth/guard/auth-token/auth-token.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig, databaseConfig],
      cache: true,
    }),
    // Database connection (using TypeORM)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: +configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        synchronize: configService.get('database.synchronize'),
        autoLoadEntities: configService.get('database.autoload'),
      }),
    }),
    // Application feature modules
    UsersModule,
    PuzzlesModule,
    NftsModule,
    ScoresModule,
    AnswersModule,
    HintsModule,
    UserProgressModule,
    AuthModule,
    LevelModule,
    LeaderboardModule,
    // JWT configuration
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Apply the AuthTokenGuard globally so all routes require authentication unless marked with @Public()
    {
      provide: APP_GUARD,
      useClass: AuthTokenGuard,
    },
  ],
})
export class AppModule {}
