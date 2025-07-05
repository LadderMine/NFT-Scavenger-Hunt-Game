import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PuzzleAccessLogService } from './puzzle-access-log.service';
import { PuzzleAccessLog } from './entities/puzzle-access-log.entity';
import { LogAccessDto } from './dto/log-access.dto';

describe('PuzzleAccessLogService', () => {
  let service: PuzzleAccessLogService;
  let repo: Repository<PuzzleAccessLog>;

  // Mock QueryBuilder for complex queries
  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
    getRawOne: jest.fn(),
  };

  const mockAccessLogRepository = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PuzzleAccessLogService,
        { provide: getRepositoryToken(PuzzleAccessLog), useValue: mockAccessLogRepository },
      ],
    }).compile();

    service = module.get<PuzzleAccessLogService>(PuzzleAccessLogService);
    repo = module.get<Repository<PuzzleAccessLog>>(getRepositoryToken(PuzzleAccessLog));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('logAccess should create and save a new log', async () => {
    const dto: LogAccessDto = { userId: 'u1', puzzleId: 'p1' };
    const newLog = new PuzzleAccessLog();
    mockAccessLogRepository.create.mockReturnValue(newLog);
    mockAccessLogRepository.save.mockResolvedValue(newLog);

    await service.logAccess(dto);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(newLog);
  });

  it('getMostAccessedPuzzles should return aggregated data', async () => {
    const expectedData = [{ puzzleId: 'p1', accessCount: '10' }];
    mockQueryBuilder.getRawMany.mockResolvedValue(expectedData);
    
    const result = await service.getMostAccessedPuzzles();
    expect(repo.createQueryBuilder).toHaveBeenCalledWith('log');
    expect(result).toEqual(expectedData);
  });
  
  it('getUniqueUsersPerPuzzle should return a count of distinct users', async () => {
    const puzzleId = 'p1';
    const expectedCount = { count: '5' };
    mockQueryBuilder.getRawOne.mockResolvedValue(expectedCount);

    const result = await service.getUniqueUsersPerPuzzle(puzzleId);
    expect(repo.createQueryBuilder().where).toHaveBeenCalledWith('log.puzzleId = :puzzleId', { puzzleId });
    expect(result).toEqual({ uniqueUserCount: 5 });
  });

  it('getTimeBasedTrends should return time-series data', async () => {
    const expectedData = [{ date: '2025-07-05', accessCount: '15' }];
    mockQueryBuilder.getRawMany.mockResolvedValue(expectedData);

    const result = await service.getTimeBasedTrends(7);
    expect(repo.createQueryBuilder().where).toHaveBeenCalled();
    expect(result).toEqual(expectedData);
  });
});