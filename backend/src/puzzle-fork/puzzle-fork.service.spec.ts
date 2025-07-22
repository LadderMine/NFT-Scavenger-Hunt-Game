import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { PuzzleForkService } from './puzzle-fork.service';
import { ForkedPuzzle } from './entities/forked-puzzle.entity';
import { PuzzleVersion } from '../puzzle-versioning/entities/puzzle-version.entity';

describe('PuzzleForkService', () => {
  let service: PuzzleForkService;
  let forkedPuzzleRepo: Repository<ForkedPuzzle>;
  let puzzleVersionRepo: Repository<PuzzleVersion>;

  const mockForkedPuzzleRepo = { create: jest.fn(), save: jest.fn() };
  const mockPuzzleVersionRepo = { findOne: jest.fn(), findOneBy: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PuzzleForkService,
        { provide: getRepositoryToken(ForkedPuzzle), useValue: mockForkedPuzzleRepo },
        { provide: getRepositoryToken(PuzzleVersion), useValue: mockPuzzleVersionRepo },
      ],
    }).compile();

    service = module.get<PuzzleForkService>(PuzzleForkService);
    forkedPuzzleRepo = module.get(getRepositoryToken(ForkedPuzzle));
    puzzleVersionRepo = module.get(getRepositoryToken(PuzzleVersion));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fork the latest version of a puzzle', async () => {
    const sourcePuzzle = { puzzleId: 'p1', version: 3, title: 'Original', content: {} };
    mockPuzzleVersionRepo.findOne.mockResolvedValue(sourcePuzzle);
    mockForkedPuzzleRepo.create.mockImplementation(p => p);
    mockForkedPuzzleRepo.save.mockImplementation(p => Promise.resolve(p));

    const result = await service.fork({ originalPuzzleId: 'p1' });

    expect(puzzleVersionRepo.findOne).toHaveBeenCalledWith({ where: { puzzleId: 'p1' }, order: { version: 'DESC' } });
    expect(forkedPuzzleRepo.create).toHaveBeenCalledWith(expect.objectContaining({ forkedFromVersion: 3 }));
    expect(result.title).toBe('Fork of: Original');
  });

  it('should fork a specific version of a puzzle with a new title', async () => {
    const sourcePuzzle = { puzzleId: 'p1', version: 1, title: 'Old Title', content: {} };
    mockPuzzleVersionRepo.findOneBy.mockResolvedValue(sourcePuzzle);
    mockForkedPuzzleRepo.create.mockImplementation(p => p);
    mockForkedPuzzleRepo.save.mockImplementation(p => Promise.resolve(p));

    const result = await service.fork({ originalPuzzleId: 'p1', version: 1, newTitle: 'My Fork' });

    expect(puzzleVersionRepo.findOneBy).toHaveBeenCalledWith({ puzzleId: 'p1', version: 1 });
    expect(forkedPuzzleRepo.create).toHaveBeenCalledWith(expect.objectContaining({ forkedFromVersion: 1 }));
    expect(result.title).toBe('My Fork');
  });

  it('should throw NotFoundException if the source puzzle does not exist', async () => {
    mockPuzzleVersionRepo.findOne.mockResolvedValue(null);
    await expect(service.fork({ originalPuzzleId: 'p-non-existent' })).rejects.toThrow(NotFoundException);
  });
});