import { Test, TestingModule } from '@nestjs/testing';
import { LevelService } from './level.service';

describe('LevelService', () => {
  let service: LevelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LevelService],
    }).compile();

    service = module.get<LevelService>(LevelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
