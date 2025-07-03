import { Test, TestingModule } from '@nestjs/testing';
import { PuzzleTranslationService } from './puzzle-translation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PuzzleTranslation } from './entities/puzzle-translation.entity';
import { Repository } from 'typeorm';

const mockTranslation = {
  id: 1,
  puzzle: { id: 'puzzle-uuid' },
  language: 'en',
  title: 'Test Title',
  description: 'Test Description',
};

describe('PuzzleTranslationService', () => {
  let service: PuzzleTranslationService;
  let repo: Repository<PuzzleTranslation>;

  const mockRepo = {
    create: jest.fn().mockImplementation(dto => ({ ...dto })),
    save: jest.fn().mockResolvedValue(mockTranslation),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PuzzleTranslationService,
        {
          provide: getRepositoryToken(PuzzleTranslation),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<PuzzleTranslationService>(PuzzleTranslationService);
    repo = module.get<Repository<PuzzleTranslation>>(getRepositoryToken(PuzzleTranslation));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a translation', async () => {
    const dto = { puzzleId: 'puzzle-uuid', language: 'en', title: 'Test Title', description: 'Test Description' };
    const result = await service.create(dto);
    expect(repo.create).toHaveBeenCalledWith({ ...dto, puzzle: { id: dto.puzzleId } });
    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual(mockTranslation);
  });

  it('should update a translation', async () => {
    mockRepo.findOne.mockResolvedValueOnce(mockTranslation);
    const dto = { title: 'Updated Title' };
    const result = await service.update(1, dto as any);
    expect(result).toEqual(mockTranslation);
  });

  it('should throw if updating non-existent translation', async () => {
    mockRepo.findOne.mockResolvedValueOnce(undefined);
    await expect(service.update(999, { title: 'x' } as any)).rejects.toThrow();
  });

  it('should find by puzzle and language', async () => {
    mockRepo.findOne.mockResolvedValueOnce(mockTranslation);
    const result = await service.findByPuzzleAndLanguage('puzzle-uuid', 'en');
    expect(result).toEqual(mockTranslation);
  });

  it('should throw if translation not found for language', async () => {
    mockRepo.findOne.mockResolvedValueOnce(undefined);
    await expect(service.findByPuzzleAndLanguage('puzzle-uuid', 'fr')).rejects.toThrow();
  });

  it('should find all translations for a puzzle', async () => {
    mockRepo.find.mockResolvedValueOnce([mockTranslation]);
    const result = await service.findAll('puzzle-uuid');
    expect(result).toEqual([mockTranslation]);
  });
}); 