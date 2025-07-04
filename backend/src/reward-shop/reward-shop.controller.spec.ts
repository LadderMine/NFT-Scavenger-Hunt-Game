import { Test, TestingModule } from '@nestjs/testing';
import { RewardShopController } from './reward-shop.controller';
import { RewardShopService } from './reward-shop.service';

describe('RewardShopController', () => {
  let controller: RewardShopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RewardShopController],
      providers: [RewardShopService],
    }).compile();

    controller = module.get<RewardShopController>(RewardShopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
