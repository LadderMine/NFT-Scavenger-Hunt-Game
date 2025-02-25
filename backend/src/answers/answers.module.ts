import { Module } from '@nestjs/common';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { HintsService } from 'src/hints/hints.service';

@Module({
  controllers: [AnswersController],
  providers: [AnswersService, HintsService], //provide hint service for intra-module dependency
  exports: [AnswersService],
})
export class AnswersModule {}
