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
import appConfig from 'config/app.config';
import databaseConfig from 'config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig, databaseConfig],
      cache: true
    }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get('database.host'),
    //     port: +configService.get('database.port'),
    //     username: configService.get('database.user'),
    //     password: configService.get('database.password'),
    //     database: configService.get('database.name'),
    //     blog: configService.get('database.blog'),
    //     synchronize: configService.get('database.synchronize'),
    //     autoLoadEntities: configService.get('database.autoload')
    //   }),
    // }),
    UsersModule,
    PuzzlesModule,
    NftsModule,
    ScoresModule,
    AnswersModule,
    HintsModule,
    UserProgressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
