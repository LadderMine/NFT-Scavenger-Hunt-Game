import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { PuzzleCategoryController } from "./puzzle-category.controller"
import { PuzzleCategoryService } from "./puzzle-category.service"
import { Category } from "./entities/category.entity"
import { CategoryPuzzle } from "./entities/puzzle.entity" // Updated import

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, CategoryPuzzle]), // Updated entity name
  ],
  controllers: [PuzzleCategoryController],
  providers: [PuzzleCategoryService],
  exports: [PuzzleCategoryService],
})
export class PuzzleCategoryModule {}
