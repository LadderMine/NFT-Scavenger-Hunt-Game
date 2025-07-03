import { Test, TestingModule } from '@nestjs/testing';
import { RewardShopService } from './reward-shop.service';

describe('RewardShopService', () => {
  let service: RewardShopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RewardShopService],
    }).compile();

    service = module.get<RewardShopService>(RewardShopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
