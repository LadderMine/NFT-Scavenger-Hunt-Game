import { Controller, Get } from '@nestjs/common';
import { NftMarketplaceStubService } from './nft-marketplace-stub.service';
import { NftItem } from './entities/nft-item.entity';

@Controller('nft-marketplace')
export class NftMarketplaceStubController {
  constructor(
    private readonly marketplaceService: NftMarketplaceStubService,
  ) {}

  @Get('list')
  listAllNfts(): NftItem[] {
    return this.marketplaceService.findAll();
  }
}