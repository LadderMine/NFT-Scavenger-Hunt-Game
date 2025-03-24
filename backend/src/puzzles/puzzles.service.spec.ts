import { Test, TestingModule } from '@nestjs/testing';
import { PuzzlesService } from './puzzles.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Puzzles } from './puzzles.entity';
import { NotFoundException } from '@nestjs/common';

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
    const updateData = { title: 'Updated Title' };
    const updatedPuzzle = await service.updatePuzzle(mockPuzzle.id, updateData);
    expect(updatedPuzzle.title).toBe('Updated Title');
  });

  it('should throw NotFoundException if puzzle is not found', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
    await expect(service.updatePuzzle(999, {})).rejects.toThrow(NotFoundException);
  });
});
