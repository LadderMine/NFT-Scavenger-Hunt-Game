import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuzzleAccessLog } from './entities/puzzle-access-log.entity';
import { PuzzleAccessLogService } from './puzzle-access-log.service';
import { PuzzleAccessLogController } from './puzzle-access-log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PuzzleAccessLog])],
  providers: [PuzzleAccessLogService],
  controllers: [PuzzleAccessLogController],
})
export class PuzzleAccessLogModule {}