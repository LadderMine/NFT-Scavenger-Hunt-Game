import { Test, TestingModule } from '@nestjs/testing';
import { PreviewPuzzleController } from './preview-puzzle.controller';
import { PreviewPuzzleService } from './preview-puzzle.service';

describe('PreviewPuzzleController', () => {
  let controller: PreviewPuzzleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreviewPuzzleController],
      providers: [PreviewPuzzleService],
    }).compile();

    controller = module.get<PreviewPuzzleController>(PreviewPuzzleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
