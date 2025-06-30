import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Puzzle } from './entities/puzzle.entity';
import { CreateCategoryDto, UpdateCategoryDto, CreatePuzzleDto, UpdatePuzzleDto, PuzzlesByCategoryResponseDto } from './dto/puzzle-category.dto';

@Injectable()
export class PuzzleCategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Puzzle)
    private puzzleRepository: Repository<Puzzle>,
  ) {}

  /**
   * Fetch all puzzles grouped by their categories
   * This is the main method requested in the task
   */
  async getPuzzlesByCategory(): Promise<PuzzlesByCategoryResponseDto[]> {
    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.puzzles', 'puzzle')
      .where('category.isActive = :isActive', { isActive: true })
      .andWhere('puzzle.isActive = :puzzleActive', { puzzleActive: true })
      .orderBy('category.sortOrder', 'ASC')
      .addOrderBy('category.name', 'ASC')
      .addOrderBy('puzzle.title', 'ASC')
      .getMany();

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      slug: category.slug,
      icon: category.icon,
      color: category.color,
      sortOrder: category.sortOrder,
      puzzles: category.puzzles || [],
      puzzleCount: category.puzzles ? category.puzzles.length : 0,
    }));
  }

  /**
   * Get all categories
   */
  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id, isActive: true },
      relations: ['puzzles'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { slug, isActive: true },
      relations: ['puzzles'],
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return category;
  }

  /**
   * Create a new category
   */
  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  /**
   * Update a category
   */
  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.getCategoryById(id);
    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  /**
   * Delete a category (soft delete by setting isActive to false)
   */
  async deleteCategory(id: number): Promise<void> {
    const category = await this.getCategoryById(id);
    category.isActive = false;
    await this.categoryRepository.save(category);
  }

  /**
   * Get all puzzles
   */
  async getAllPuzzles(): Promise<Puzzle[]> {
    return this.puzzleRepository.find({
      where: { isActive: true },
      relations: ['categories'],
      order: { title: 'ASC' },
    });
  }

  /**
   * Get puzzle by ID
   */
  async getPuzzleById(id: number): Promise<Puzzle> {
    const puzzle = await this.puzzleRepository.findOne({
      where: { id, isActive: true },
      relations: ['categories'],
    });

    if (!puzzle) {
      throw new NotFoundException(`Puzzle with ID ${id} not found`);
    }

    return puzzle;
  }

  /**
   * Create a new puzzle
   */
  async createPuzzle(createPuzzleDto: CreatePuzzleDto): Promise<Puzzle> {
    const puzzle = this.puzzleRepository.create(createPuzzleDto);
    
    // Handle category relationships if categoryIds are provided
    if (createPuzzleDto.categoryIds && createPuzzleDto.categoryIds.length > 0) {
      const categories = await this.categoryRepository.findByIds(createPuzzleDto.categoryIds);
      puzzle.categories = categories;
    }

    return this.puzzleRepository.save(puzzle);
  }

  /**
   * Update a puzzle
   */
  async updatePuzzle(id: number, updatePuzzleDto: UpdatePuzzleDto): Promise<Puzzle> {
    const puzzle = await this.getPuzzleById(id);
    Object.assign(puzzle, updatePuzzleDto);

    // Handle category relationships if categoryIds are provided
    if (updatePuzzleDto.categoryIds) {
      const categories = await this.categoryRepository.findByIds(updatePuzzleDto.categoryIds);
      puzzle.categories = categories;
    }

    return this.puzzleRepository.save(puzzle);
  }

  /**
   * Delete a puzzle (soft delete by setting isActive to false)
   */
  async deletePuzzle(id: number): Promise<void> {
    const puzzle = await this.getPuzzleById(id);
    puzzle.isActive = false;
    await this.puzzleRepository.save(puzzle);
  }

  /**
   * Get puzzles by category ID
   */
  async getPuzzlesByCategoryId(categoryId: number): Promise<Puzzle[]> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId, isActive: true },
      relations: ['puzzles'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    return category.puzzles.filter(puzzle => puzzle.isActive);
  }

  /**
   * Get puzzles by difficulty level
   */
  async getPuzzlesByDifficulty(difficulty: string): Promise<Puzzle[]> {
    return this.puzzleRepository.find({
      where: { difficulty, isActive: true },
      relations: ['categories'],
      order: { title: 'ASC' },
    });
  }

  /**
   * Search puzzles by title or description
   */
  async searchPuzzles(searchTerm: string): Promise<Puzzle[]> {
    return this.puzzleRepository
      .createQueryBuilder('puzzle')
      .leftJoinAndSelect('puzzle.categories', 'category')
      .where('puzzle.isActive = :isActive', { isActive: true })
      .andWhere(
        '(puzzle.title ILIKE :searchTerm OR puzzle.description ILIKE :searchTerm)',
        { searchTerm: `%${searchTerm}%` }
      )
      .orderBy('puzzle.title', 'ASC')
      .getMany();
  }

  /**
   * Seed initial categories for the NFT Scavenger Hunt game
   */
  async seedInitialCategories(): Promise<void> {
    const existingCategories = await this.categoryRepository.count();
    
    if (existingCategories > 0) {
      return; // Categories already exist
    }

    const initialCategories = [
      {
        name: 'Blockchain Basics',
        description: 'Learn the fundamentals of blockchain technology, including concepts like decentralization, consensus mechanisms, and cryptographic principles.',
        slug: 'blockchain-basics',
        icon: '🔗',
        color: '#3B82F6',
        sortOrder: 1,
      },
      {
        name: 'Smart Contracts',
        description: 'Explore smart contract development, deployment, and interaction. Learn about contract security, gas optimization, and best practices.',
        slug: 'smart-contracts',
        icon: '📜',
        color: '#10B981',
        sortOrder: 2,
      },
      {
        name: 'StarkNet Deep Dive',
        description: 'Master StarkNet-specific concepts including Cairo programming, STARK proofs, L2 scaling, and StarkNet ecosystem tools.',
        slug: 'starknet-deep-dive',
        icon: '⚡',
        color: '#8B5CF6',
        sortOrder: 3,
      },
      {
        name: 'NFT Fundamentals',
        description: 'Understand NFT standards, metadata, IPFS, and the complete lifecycle of creating, minting, and trading NFTs.',
        slug: 'nft-fundamentals',
        icon: '🎨',
        color: '#F59E0B',
        sortOrder: 4,
      },
      {
        name: 'DeFi Concepts',
        description: 'Learn about decentralized finance including liquidity pools, yield farming, AMMs, and DeFi protocols.',
        slug: 'defi-concepts',
        icon: '💰',
        color: '#EF4444',
        sortOrder: 5,
      },
    ];

    for (const categoryData of initialCategories) {
      await this.categoryRepository.save(categoryData);
    }
  }
} 