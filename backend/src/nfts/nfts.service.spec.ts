import { Test, TestingModule } from '@nestjs/testing';
import { NFTsService } from './nfts.service';

describe('NftsService', () => {
  let service: NFTsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NFTsService],
    }).compile();

    service = module.get<NFTsService>(NFTsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
