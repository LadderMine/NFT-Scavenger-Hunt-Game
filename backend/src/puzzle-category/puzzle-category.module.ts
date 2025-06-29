import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuzzleCategoryController } from './puzzle-category.controller';
import { PuzzleCategoryService } from './puzzle-category.service';
import { Category } from './entities/category.entity';
import { Puzzle } from './entities/puzzle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Puzzle]),
  ],
  controllers: [PuzzleCategoryController],
  providers: [PuzzleCategoryService],
  exports: [PuzzleCategoryService],
})
export class PuzzleCategoryModule {} 