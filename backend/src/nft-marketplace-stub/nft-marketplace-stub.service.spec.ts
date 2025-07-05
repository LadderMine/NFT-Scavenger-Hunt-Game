import { Test, TestingModule } from '@nestjs/testing';
import { NftMarketplaceStubService } from './nft-marketplace-stub.service';
import { NftItem } from './entities/nft-item.entity';

describe('NftMarketplaceStubService', () => {
  let service: NftMarketplaceStubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NftMarketplaceStubService],
    }).compile();

    service = module.get<NftMarketplaceStubService>(NftMarketplaceStubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a static array of NftItem objects', () => {
      const nfts = service.findAll();

      expect(Array.isArray(nfts)).toBe(true);
      expect(nfts.length).toBe(4); 
      const firstNft = nfts[0];
      expect(firstNft).toBeInstanceOf(Object);
      expect(firstNft).toHaveProperty('id');
      expect(firstNft).toHaveProperty('name');
      expect(firstNft).toHaveProperty('imageUrl');
      expect(firstNft).toHaveProperty('price');
      expect(firstNft).toHaveProperty('description');
    });
  });
});