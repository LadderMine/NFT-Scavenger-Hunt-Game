import { Test, TestingModule } from '@nestjs/testing';
import { PuzzleDependencyService } from './puzzle-dependency.service';

describe('PuzzleDependencyService', () => {
  let service: PuzzleDependencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PuzzleDependencyService],
    }).compile();

    service = module.get<PuzzleDependencyService>(PuzzleDependencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
