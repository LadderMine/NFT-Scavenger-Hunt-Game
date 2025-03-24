import { Test, TestingModule } from '@nestjs/testing';
import { RankService } from './rank.service';

describe('RankService', () => {
  let service: RankService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RankService],
    }).compile();

    service = module.get<RankService>(RankService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
