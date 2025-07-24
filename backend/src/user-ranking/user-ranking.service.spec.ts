import { Test, TestingModule } from '@nestjs/testing';
import { UserRankingService } from './user-ranking.service';

describe('UserRankingService', () => {
  let service: UserRankingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRankingService],
    }).compile();

    service = module.get<UserRankingService>(UserRankingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
