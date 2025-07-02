import { Test, TestingModule } from '@nestjs/testing';
import { PuzzleCommentController } from './puzzle-comment.controller';
import { PuzzleCommentService } from './puzzle-comment.service';

describe('PuzzleCommentController', () => {
  let controller: PuzzleCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PuzzleCommentController],
      providers: [PuzzleCommentService],
    }).compile();

    controller = module.get<PuzzleCommentController>(PuzzleCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
