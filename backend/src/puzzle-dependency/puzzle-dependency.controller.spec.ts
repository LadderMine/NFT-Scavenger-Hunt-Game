import { Test, TestingModule } from '@nestjs/testing';
import { PuzzleDependencyController } from './puzzle-dependency.controller';
import { PuzzleDependencyService } from './puzzle-dependency.service';

describe('PuzzleDependencyController', () => {
  let controller: PuzzleDependencyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PuzzleDependencyController],
      providers: [PuzzleDependencyService],
    }).compile();

    controller = module.get<PuzzleDependencyController>(PuzzleDependencyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
