import { Test, TestingModule } from '@nestjs/testing';
import { NftMarketplaceStubController } from './nft-marketplace-stub.controller';
import { NftMarketplaceStubService } from './nft-marketplace-stub.service';

describe('NftMarketplaceStubController', () => {
  let controller: NftMarketplaceStubController;
  let service: NftMarketplaceStubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NftMarketplaceStubController],
      providers: [NftMarketplaceStubService], // Use the real service since it's just a stub
    }).compile();

    controller = module.get<NftMarketplaceStubController>(
      NftMarketplaceStubController,
    );
    service = module.get<NftMarketplaceStubService>(NftMarketplaceStubService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listAllNfts', () => {
    it('should call the findAll method on the service', () => {
      const findAllSpy = jest.spyOn(service, 'findAll');
      controller.listAllNfts();
      expect(findAllSpy).toHaveBeenCalled();
    });

    it('should return an array of NFT items', () => {
      const result = controller.listAllNfts();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
    });
  });
});