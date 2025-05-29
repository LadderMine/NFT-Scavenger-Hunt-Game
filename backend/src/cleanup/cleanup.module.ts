// cleanup/cleanup.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CleanupService } from './providers/cleanup.service';
import { PuzzleDto } from 'src/puzzles/dtos/puzzles.dto';

@Module({
  imports: [TypeOrmModule.forFeature([PuzzleDto])],
  providers: [CleanupService],
})
export class CleanupModule {}