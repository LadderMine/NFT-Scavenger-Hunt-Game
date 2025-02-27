import { Module } from '@nestjs/common';
import { NftsController } from './nfts.controller';
import { NftsService } from './nfts.service';
import { PuzzlesService } from 'src/puzzles/puzzles.service';

@Module({
  controllers: [NftsController],
  providers: [NftsService],
  exports: [NftsService],
})
export class NftsModule {}
