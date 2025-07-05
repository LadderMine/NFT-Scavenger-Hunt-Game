import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { PuzzleVersioningService } from './puzzle-versioning.service';
import { PuzzleVersion } from './entities/puzzle-version.entity';
import { CreatePuzzleVersionDto } from './dto/create-puzzle-version.dto';

describe('PuzzleVersioningService', () => {
  let service: PuzzleVersioningService;
  let repo: Repository<PuzzleVersion>;

  const mockPuzzleVersionRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PuzzleVersioningService,
        {
          provide: getRepositoryToken(PuzzleVersion),
          useValue: mockPuzzleVersionRepository,
        },
      ],
    }).compile();

    service = module.get<PuzzleVersioningService>(PuzzleVersioningService);
    repo = module.get<Repository<PuzzleVersion>>(getRepositoryToken(PuzzleVersion));
    // Reset mocks before each test
    jest.clearAllMocks(); 
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNewVersion', () => {
    it('should create version 1 for a new puzzle', async () => {
      const dto: CreatePuzzleVersionDto = { title: 'First Puzzle', content: {} };
      
      // Since it's a new puzzle, findOne returns null for the latest version
      mockPuzzleVersionRepository.findOne.mockResolvedValue(null);
      mockPuzzleVersionRepository.create.mockImplementation(p => p);
      mockPuzzleVersionRepository.save.mockImplementation(p => Promise.resolve({ ...p, id: 'uuid' }));

      // We spy on the service itself to check the call to findLatestVersion
      const findLatestSpy = jest.spyOn(service, 'findLatestVersion').mockImplementation(() => {
        throw new NotFoundException();
      });

      const result = await service.createNewVersion(dto);

      expect(result.version).toBe(1);
      expect(result.puzzleId).toBeDefined();
      expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ version: 1 }));
      findLatestSpy.mockRestore();
    });

    it('should increment the version for an existing puzzle', async () => {
      const puzzleId = 'puzzle-123';
      const dto: CreatePuzzleVersionDto = { puzzleId, title: 'Updated Puzzle', content: {} };
      const latestVersion = { puzzleId, version: 3, title: 'Old Title', content: {} };

      const findLatestSpy = jest.spyOn(service, 'findLatestVersion').mockResolvedValue(latestVersion as PuzzleVersion);
      mockPuzzleVersionRepository.create.mockImplementation(p => p);
      mockPuzzleVersionRepository.save.mockImplementation(p => Promise.resolve({ ...p, id: 'uuid' }));
      
      const result = await service.createNewVersion(dto);

      expect(result.version).toBe(4);
      expect(result.puzzleId).toBe(puzzleId);
      expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ version: 4 }));
      findLatestSpy.mockRestore();
    });
  });

  describe('findLatestVersion', () => {
    it('should return the latest version', async () => {
      const puzzleId = 'puzzle-123';
      const mockVersion = { puzzleId, version: 1 };
      mockPuzzleVersionRepository.findOne.mockResolvedValue(mockVersion);

      const result = await service.findLatestVersion(puzzleId);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { puzzleId }, order: { version: 'DESC' } });
      expect(result).toEqual(mockVersion);
    });

    it('should throw NotFoundException if no puzzle is found', async () => {
      mockPuzzleVersionRepository.findOne.mockResolvedValue(null);
      await expect(service.findLatestVersion('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllVersions', () => {
    it('should return all versions for a puzzle', async () => {
      const puzzleId = 'puzzle-123';
      const mockVersions = [{ puzzleId, version: 2 }, { puzzleId, version: 1 }];
      mockPuzzleVersionRepository.find.mockResolvedValue(mockVersions);

      const result = await service.findAllVersions(puzzleId);
      expect(repo.find).toHaveBeenCalledWith({ where: { puzzleId }, order: { version: 'DESC' } });
      expect(result).toEqual(mockVersions);
    });

    it('should throw NotFoundException if no versions are found', async () => {
      mockPuzzleVersionRepository.find.mockResolvedValue([]);
      await expect(service.findAllVersions('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});