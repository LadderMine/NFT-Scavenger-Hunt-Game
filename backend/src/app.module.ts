/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PuzzlesModule } from './puzzles/puzzles.module';
import { NftsModule } from './nfts/nfts.module';
import { ScoresModule } from './scores/scores.module';
import { AnswersModule } from './answers/answers.module';
import { HintsModule } from './hints/hints.module';
import { UserProgressModule } from './user-progress/user-progress.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import appConfig from 'config/app.config';
import databaseConfig from 'config/database.config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './auth/config/jwt.config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthTokenGuard } from './auth/guard/auth-token/auth-token.guard';
import { NotificationSettingsModule } from './notification-settings/notification-settings.module';
import { RankModule } from './rank/rank.module';
import { LevelModule } from './level/level.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { ApiTrackingModule } from './api-tracking/api-tracking.module';
import { ApiTrackingInterceptor } from './api-tracking/interceptor/api-tracking.interceptor';
// Remove unused import of Puzzles entity
import { PuzzleSubscriber } from './level/decorators/subscriber-decorator';
import { RankService } from './rank/providers/rank.service';
import { RankJob } from './rank/providers/rank.job';
import { StripeModule } from './stripe/stripe.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TransactionModule } from './transaction/transaction.module';
import { EmailModule } from './email/email.module';
import { UserActivityLogsModule } from './user-activity-logs/user-activity-logs.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { EmailChangeModule } from './email-change/email-change.module';
import { ErrorLoggingModule } from './error-logging/error-logging.module';
import { ErrorLoggingInterceptor } from './error-logging/interceptors/error-logging.interceptor';
import { RefundsModule } from './refunds/refunds.module';
import { PromoCodeModule } from './promo-code/promo-code.module';
import { PreviewPuzzleModule } from './preview-puzzle/preview-puzzle.module';
import { PuzzleMatchingModule } from './puzzle-matching/puzzle-matching.module';
import { UserEventsModule } from './user-events/user-events.module';


@Module({
  imports: [
    StripeModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig, databaseConfig],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      //end
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: +configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        blog: configService.get('database.blog'),
        synchronize: configService.get('database.synchronize'),
        autoLoadEntities: configService.get('database.autoload'),
      }),
    }),
    UsersModule,
    PuzzlesModule,
    NftsModule,
    ScoresModule,
    AnswersModule,
    HintsModule,
    UserProgressModule,
    AuthModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    LevelModule,
    LeaderboardModule,
    TransactionModule,
    SubscriptionModule,
    EmailModule,
    EmailChangeModule,
    UserActivityLogsModule,
    AuditLogsModule,
    ApiTrackingModule,
   
    // JWT configuration
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    NotificationSettingsModule,
    ErrorLoggingModule,
    RefundsModule,
    PromoCodeModule,
    PreviewPuzzleModule,
    PuzzleMatchingModule,
    UserEventsModule,
  ],
  controllers: [AppController],
  providers: [
    PuzzleSubscriber,
    AppService,
    RankService,
    RankJob,
    {
      provide: APP_GUARD,
      useClass: AuthTokenGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiTrackingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorLoggingInterceptor,
    },
  ],
})
export class AppModule {}
