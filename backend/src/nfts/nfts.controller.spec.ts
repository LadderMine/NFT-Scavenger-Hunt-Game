import { Test, TestingModule } from '@nestjs/testing';
import { NFTsController } from './nfts.controller';

describe('NftsController', () => {
  let controller: NFTsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NFTsController],
    }).compile();

    controller = module.get<NFTsController>(NFTsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
