import { Test, TestingModule } from '@nestjs/testing';
import { PuzzlesService } from './puzzles.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Puzzles } from './puzzles.entity';
import { NotFoundException } from '@nestjs/common';
import { LevelEnum } from 'src/enums/LevelEnum';

const mockPuzzle = {
  id: 1,
  title: 'Original Title',
  description: 'Original Description',
  difficulty: 'EASY',
  solution: 'original-solution',
};

describe('PuzzlesService', () => {
  let service: PuzzlesService;
  let repository: Repository<Puzzles>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PuzzlesService,
        {
          provide: getRepositoryToken(Puzzles),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockPuzzle),
            save: jest.fn().mockImplementation((puzzle) => Promise.resolve({ ...mockPuzzle, ...puzzle })),
          },
        },
      ],
    }).compile();

    service = module.get<PuzzlesService>(PuzzlesService);
    repository = module.get<Repository<Puzzles>>(getRepositoryToken(Puzzles));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update a puzzle', async () => {
    const updateData: Partial<Puzzles> = { title: 'Updated Title' };
    const updatedPuzzle = await service.updatePuzzle(mockPuzzle.id, updateData);
    expect(updatedPuzzle.title).toBe('Updated Title');
  });

  it('should throw NotFoundException if puzzle is not found', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
    await expect(service.updatePuzzle(999, {})).rejects.toThrow(NotFoundException);
  });

  describe('deletePuzzle', () => {
    it('should delete a puzzle', async () => {
      const puzzle = {
        id: 1,
        hints: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        pointValue: 2,
        nfts: null,
        userProgress: null,
        level: null,
        levelEnum: LevelEnum.EASY,
        scores: [],
        answers: [],
        updateLevelCount: jest.fn(), // important to mock
      } as unknown as Puzzles;
      
      jest.spyOn(repository, 'findOne').mockResolvedValue(puzzle);
      jest.spyOn(repository, 'softRemove').mockResolvedValue(puzzle);

      await expect(service.deletePuzzle('uuid')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if puzzle not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.deletePuzzle('invalid-uuid')).rejects.toThrow(NotFoundException);
    });
  });
});