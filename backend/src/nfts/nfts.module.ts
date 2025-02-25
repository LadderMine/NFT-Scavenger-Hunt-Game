import { Module } from '@nestjs/common';
import { NFTsController } from './nfts.controller';
import { NFTsService } from './nfts.service';

@Module({
  controllers: [NFTsController],
  providers: [NFTsService],
})
export class NftsModule {}
