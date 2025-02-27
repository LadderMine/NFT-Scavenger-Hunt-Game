import { Module } from '@nestjs/common';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answers } from './answers.entity';
import { HintsModule } from '../hints/hints.module';

@Module({
  imports: [TypeOrmModule.forFeature([Answers]), HintsModule], // Register Answer entity & import HintsModule
  controllers: [AnswersController],
  providers: [AnswersService], 
  exports: [AnswersService],
})
export class AnswersModule {}
