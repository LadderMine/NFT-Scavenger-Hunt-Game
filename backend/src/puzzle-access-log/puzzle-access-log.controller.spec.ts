import { Test, TestingModule } from '@nestjs/testing';
import { PuzzleAccessLogController } from './puzzle-access-log.controller';
import { PuzzleAccessLogService } from './puzzle-access-log.service';
import { LogAccessDto } from './dto/log-access.dto';

describe('PuzzleAccessLogController', () => {
  let controller: PuzzleAccessLogController;
  let service: PuzzleAccessLogService;

  const mockAccessLogService = {
    logAccess: jest.fn(),
    getMostAccessedPuzzles: jest.fn(),
    getUniqueUsersPerPuzzle: jest.fn(),
    getTimeBasedTrends: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PuzzleAccessLogController],
      providers: [{ provide: PuzzleAccessLogService, useValue: mockAccessLogService }],
    }).compile();

    controller = module.get<PuzzleAccessLogController>(PuzzleAccessLogController);
    service = module.get<PuzzleAccessLogService>(PuzzleAccessLogService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call logAccess service method on POST /log', () => {
    const dto: LogAccessDto = { userId: 'u1', puzzleId: 'p1' };
    controller.logAccess(dto);
    expect(service.logAccess).toHaveBeenCalledWith(dto);
  });

  it('should call getMostAccessedPuzzles service method on GET /analytics/most-accessed', () => {
    controller.getMostAccessedPuzzles();
    expect(service.getMostAccessedPuzzles).toHaveBeenCalled();
  });

  it('should call getUniqueUsersPerPuzzle service method on GET /analytics/unique-users/:puzzleId', () => {
    const puzzleId = 'p1';
    controller.getUniqueUsersPerPuzzle(puzzleId);
    expect(service.getUniqueUsersPerPuzzle).toHaveBeenCalledWith(puzzleId);
  });

  it('should call getTimeBasedTrends service method on GET /analytics/trends', () => {
    controller.getTimeBasedTrends(14);
    expect(service.getTimeBasedTrends).toHaveBeenCalledWith(14);
  });
});