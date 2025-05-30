import { Test, TestingModule } from '@nestjs/testing';
import { PreviewPuzzleService } from './preview-puzzle.service';

describe('PreviewPuzzleService', () => {
  let service: PreviewPuzzleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreviewPuzzleService],
    }).compile();

    service = module.get<PreviewPuzzleService>(PreviewPuzzleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
