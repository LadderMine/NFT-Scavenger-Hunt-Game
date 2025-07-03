import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { AuthModule } from "./auth/auth.module"
import { UserInventoryModule } from "./user-inventory/user-inventory.module"
import appConfig from "config/app.config"
import databaseConfig from "config/database.config"
import { PuzzleCategoryModule } from "./puzzle-category/puzzle-category.module"
import { RewardsModule } from "./rewards/rewards.module"
import { PuzzleModule } from "./puzzle/puzzle.module"
import { PuzzleSubmissionModule } from "./puzzle-submission/puzzle-submission.module"
import { ContentModule } from "./content/content.module"
import { UserReportCardModule } from "./user-report-card/user-report-card.module"
import { PuzzleDependencyModule } from "./puzzle-dependency/puzzle-dependency.module"
import { TimeTrialModule } from "./time-trial/time-trial.module"
import { InAppNotificationsModule } from "./in-app-notifications/in-app-notifications.module"
import { User } from "./auth/entities/user.entity"
import { TimeTrial } from "./time-trial/time-trial.entity"
import { Puzzle } from "./puzzle/puzzle.entity"
import { Category } from "./puzzle-category/entities/category.entity"
import { RewardShopModule } from './reward-shop/reward-shop.module';
import { ApiKeyModule } from './api-key/api-key.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig, databaseConfig],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities: [User, TimeTrial, Puzzle, Category],
        synchronize: configService.get('database.synchronize'),
        autoLoadEntities: configService.get('database.autoload'),
      }),
    }),
    SessionModule,
    AuthModule,
    UserInventoryModule,
    PuzzleCategoryModule,
    RewardsModule,
    PuzzleModule,
    PuzzleSubmissionModule,
    ContentModule,
    UserReportCardModule,
    PuzzleDependencyModule,
    TimeTrialModule,
    InAppNotificationsModule,
    PuzzleTranslationModule,
    NFTClaimModule,
    RewardShopModule,
    ApiKeyModule,
    UserReactionModule,
    MultiplayerQueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}