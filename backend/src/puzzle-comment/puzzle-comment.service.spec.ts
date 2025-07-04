import { Test, TestingModule } from '@nestjs/testing';
import { PuzzleCommentService } from './puzzle-comment.service';

describe('PuzzleCommentService', () => {
  let service: PuzzleCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PuzzleCommentService],
    }).compile();

    service = module.get<PuzzleCommentService>(PuzzleCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
