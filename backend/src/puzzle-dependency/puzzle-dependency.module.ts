import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuzzleDependency } from './entities/puzzle-dependency.entity';
import { PuzzleCompletion } from './entities/puzzle-completion.entity';
import { PuzzleDependencyService } from './puzzle-dependency.service';
import { PuzzleDependencyController } from './puzzle-dependency.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PuzzleDependency, PuzzleCompletion])
  ],
  controllers: [PuzzleDependencyController],
  providers: [PuzzleDependencyService],
  exports: [PuzzleDependencyService], 
})
export class PuzzleDependencyModule {}

