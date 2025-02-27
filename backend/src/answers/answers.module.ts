import { Module } from '@nestjs/common';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answers } from './answers.entity';
import { HintsModule } from '../hints/hints.module';
import { Answer } from './answers.entity';
import { Puzzles } from '../puzzles/puzzles.entity';
import { User } from '../users/users.entity';

@Module({
imports: [TypeOrmModule.forFeature([Answer, Answers, Puzzles, User]), HintsModule], // Register Answer entity & import HintsModule
  providers: [AnswersService],
  controllers: [AnswersController],
  exports: [AnswersService],
})
export class AnswersModule {}
