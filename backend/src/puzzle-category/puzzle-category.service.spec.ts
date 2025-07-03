import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PuzzleCategoryService } from './puzzle-category.service';
import { Category } from './entities/category.entity';
import { Puzzle } from './entities/puzzle.entity';
import { NotFoundException } from '@nestjs/common';

describe('PuzzleCategoryService', () => {
  let service: PuzzleCategoryService;
  let categoryRepository: Repository<Category>;
  let puzzleRepository: Repository<Puzzle>;

  const mockCategoryRepository = {
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    })),
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
    findByIds: jest.fn(),
  };

  const mockPuzzleRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PuzzleCategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
        {
          provide: getRepositoryToken(Puzzle),
          useValue: mockPuzzleRepository,
        },
      ],
    }).compile();

    service = module.get<PuzzleCategoryService>(PuzzleCategoryService);
    categoryRepository = module.get<Repository<Category>>(getRepositoryToken(Category));
    puzzleRepository = module.get<Repository<Puzzle>>(getRepositoryToken(Puzzle));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPuzzlesByCategory', () => {
    it('should return puzzles grouped by categories', async () => {
      const mockCategories = [
        {
          id: 1,
          name: 'Blockchain Basics',
          description: 'Learn blockchain fundamentals',
          slug: 'blockchain-basics',
          icon: '🔗',
          color: '#3B82F6',
          sortOrder: 1,
          puzzles: [
            {
              id: 1,
              title: 'What is Blockchain?',
              description: 'Learn about blockchain technology',
              difficulty: 'BEGINNER',
              points: 10,
              isActive: true,
              estimatedTime: 15,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
      ];

      mockCategoryRepository.createQueryBuilder().getMany.mockResolvedValue(mockCategories);

      const result = await service.getPuzzlesByCategory();

      expect(result).toEqual([
        {
          id: 1,
          name: 'Blockchain Basics',
          description: 'Learn blockchain fundamentals',
          slug: 'blockchain-basics',
          icon: '🔗',
          color: '#3B82F6',
          sortOrder: 1,
          puzzles: mockCategories[0].puzzles,
          puzzleCount: 1,
        },
      ]);
    });
  });

  describe('getAllCategories', () => {
    it('should return all active categories', async () => {
      const mockCategories = [
        {
          id: 1,
          name: 'Blockchain Basics',
          isActive: true,
        },
      ];

      mockCategoryRepository.find.mockResolvedValue(mockCategories);

      const result = await service.getAllCategories();

      expect(result).toEqual(mockCategories);
      expect(mockCategoryRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
        order: { sortOrder: 'ASC', name: 'ASC' },
      });
    });
  });

  describe('getCategoryById', () => {
    it('should return category by ID', async () => {
      const mockCategory = {
        id: 1,
        name: 'Blockchain Basics',
        isActive: true,
        puzzles: [],
      };

      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);

      const result = await service.getCategoryById(1);

      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException when category not found', async () => {
      mockCategoryRepository.findOne.mockResolvedValue(null);

      await expect(service.getCategoryById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const createCategoryDto = {
        name: 'New Category',
        description: 'A new category',
        slug: 'new-category',
      };

      const mockCategory = { id: 1, ...createCategoryDto };
      mockCategoryRepository.create.mockReturnValue(mockCategory);
      mockCategoryRepository.save.mockResolvedValue(mockCategory);

      const result = await service.createCategory(createCategoryDto);

      expect(result).toEqual(mockCategory);
      expect(mockCategoryRepository.create).toHaveBeenCalledWith(createCategoryDto);
      expect(mockCategoryRepository.save).toHaveBeenCalledWith(mockCategory);
    });
  });

  describe('getAllPuzzles', () => {
    it('should return all active puzzles', async () => {
      const mockPuzzles = [
        {
          id: 1,
          title: 'Test Puzzle',
          isActive: true,
          categories: [],
        },
      ];

      mockPuzzleRepository.find.mockResolvedValue(mockPuzzles);

      const result = await service.getAllPuzzles();

      expect(result).toEqual(mockPuzzles);
      expect(mockPuzzleRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
        relations: ['categories'],
        order: { title: 'ASC' },
      });
    });
  });

  describe('createPuzzle', () => {
    it('should create a new puzzle with categories', async () => {
      const createPuzzleDto = {
        title: 'New Puzzle',
        description: 'A new puzzle',
        difficulty: 'BEGINNER',
        categoryIds: [1, 2],
      };

      const mockCategories = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
      ];

      const mockPuzzle = {
        id: 1,
        ...createPuzzleDto,
        categories: mockCategories,
      };

      mockPuzzleRepository.create.mockReturnValue(mockPuzzle);
      mockCategoryRepository.findByIds.mockResolvedValue(mockCategories);
      mockPuzzleRepository.save.mockResolvedValue(mockPuzzle);

      const result = await service.createPuzzle(createPuzzleDto);

      expect(result).toEqual(mockPuzzle);
      expect(mockCategoryRepository.findByIds).toHaveBeenCalledWith([1, 2]);
    });
  });

  describe('seedInitialCategories', () => {
    it('should seed initial categories when none exist', async () => {
      mockCategoryRepository.count.mockResolvedValue(0);
      mockCategoryRepository.save.mockResolvedValue({ id: 1 });

      await service.seedInitialCategories();

      expect(mockCategoryRepository.count).toHaveBeenCalled();
      expect(mockCategoryRepository.save).toHaveBeenCalledTimes(5); // 5 initial categories
    });

    it('should not seed categories when they already exist', async () => {
      mockCategoryRepository.count.mockResolvedValue(5);

      await service.seedInitialCategories();

      expect(mockCategoryRepository.count).toHaveBeenCalled();
      expect(mockCategoryRepository.save).not.toHaveBeenCalled();
    });
  });
}); 