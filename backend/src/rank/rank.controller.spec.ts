import { Test, TestingModule } from '@nestjs/testing';
import { RankController } from './rank.controller';
import { RankService } from './rank.service';

describe('RankController', () => {
  let controller: RankController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankController],
      providers: [RankService],
    }).compile();

    controller = module.get<RankController>(RankController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
