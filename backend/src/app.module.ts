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

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: '',
        port: 5432,
        username: 'test',
        password: 'test',
        database: 'test',
        entities: [],
      }),
    }),
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
