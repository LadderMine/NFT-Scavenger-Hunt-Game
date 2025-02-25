import { Module } from '@nestjs/common';
import { NftsController } from './nfts.controller';
import { NftsService } from './nfts.service';

@Module({
  controllers: [NftsController],
  providers: [NftsService]
})
export class NftsModule {}
