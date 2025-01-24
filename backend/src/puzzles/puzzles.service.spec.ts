import { Test, TestingModule } from '@nestjs/testing';
import { PuzzlesService } from './puzzles.service';

describe('PuzzlesService', () => {
  let service: PuzzlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PuzzlesService],
    }).compile();

    service = module.get<PuzzlesService>(PuzzlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
