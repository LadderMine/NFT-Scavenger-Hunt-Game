import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuzzleVersion } from './entities/puzzle-version.entity';
import { PuzzleVersioningService } from './puzzle-versioning.service';
import { PuzzleVersioningController } from './puzzle-versioning.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PuzzleVersion])],
  providers: [PuzzleVersioningService],
  controllers: [PuzzleVersioningController],
})
export class PuzzleVersioningModule {}