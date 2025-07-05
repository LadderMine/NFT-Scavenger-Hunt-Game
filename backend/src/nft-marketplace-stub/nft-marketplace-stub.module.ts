import { Module } from '@nestjs/common';
import { NftMarketplaceStubService } from './nft-marketplace-stub.service';
import { NftMarketplaceStubController } from './nft-marketplace-stub.controller';

@Module({
  controllers: [NftMarketplaceStubController],
  providers: [NftMarketplaceStubService],
})
export class NftMarketplaceStubModule {}