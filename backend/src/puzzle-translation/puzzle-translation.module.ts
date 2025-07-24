import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuzzleTranslation } from './entities/puzzle-translation.entity';
import { PuzzleTranslationService } from './puzzle-translation.service';
import { PuzzleTranslationController } from './puzzle-translation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PuzzleTranslation])],
  providers: [PuzzleTranslationService],
  controllers: [PuzzleTranslationController],
  exports: [PuzzleTranslationService],
})
export class PuzzleTranslationModule {} 