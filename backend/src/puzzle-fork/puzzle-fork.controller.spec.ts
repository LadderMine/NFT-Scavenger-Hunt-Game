import { Test, TestingModule } from '@nestjs/testing';
import { PuzzleForkController } from './puzzle-fork.controller';
import { PuzzleForkService } from './puzzle-fork.service';
import { CreateForkDto } from './dto/create-fork.dto';

describe('PuzzleForkController', () => {
  let controller: PuzzleForkController;
  let service: PuzzleForkService;

  const mockPuzzleForkService = {
    fork: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PuzzleForkController],
      providers: [{ provide: PuzzleForkService, useValue: mockPuzzleForkService }],
    }).compile();

    controller = module.get<PuzzleForkController>(PuzzleForkController);
    service = module.get<PuzzleForkService>(PuzzleForkService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call the fork service with the correct DTO', () => {
    const dto: CreateForkDto = { originalPuzzleId: 'p1', version: 2 };
    controller.forkPuzzle(dto);
    expect(service.fork).toHaveBeenCalledWith(dto);
  });
});