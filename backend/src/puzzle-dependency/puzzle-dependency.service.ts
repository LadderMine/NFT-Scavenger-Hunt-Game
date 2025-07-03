import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PuzzleDependency } from './entities/puzzle-dependency.entity';
import { PuzzleCompletion } from './entities/puzzle-completion.entity';
import { CreatePuzzleDependencyDto } from './dto/create-puzzle-dependency.dto';
import { UpdatePuzzleDependencyDto } from './dto/update-puzzle-dependency.dto';
import { EligibilityResult, DependencyChain } from './interfaces/eligibility-result.interface';

@Injectable()
export class PuzzleDependencyService {
  constructor(
    @InjectRepository(PuzzleDependency)
    private puzzleDependencyRepository: Repository<PuzzleDependency>,
    @InjectRepository(PuzzleCompletion)
    private puzzleCompletionRepository: Repository<PuzzleCompletion>,
  ) {}

  // CRUD Operations for Dependencies
  async create(createPuzzleDependencyDto: CreatePuzzleDependencyDto): Promise<PuzzleDependency> {
    const { puzzleId, dependsOnPuzzleId } = createPuzzleDependencyDto;

    // Prevent self-dependency
    if (puzzleId === dependsOnPuzzleId) {
      throw new BadRequestException('A puzzle cannot depend on itself');
    }

    // Check for existing dependency
    const existing = await this.puzzleDependencyRepository.findOne({
      where: { puzzleId, dependsOnPuzzleId }
    });

    if (existing) {
      throw new ConflictException('This dependency already exists');
    }

    // Check for circular dependencies
    const wouldCreateCircle = await this.wouldCreateCircularDependency(puzzleId, dependsOnPuzzleId);
    if (wouldCreateCircle) {
      throw new BadRequestException('This dependency would create a circular reference');
    }

    const dependency = this.puzzleDependencyRepository.create(createPuzzleDependencyDto);
    return await this.puzzleDependencyRepository.save(dependency);
  }

  async findAll(): Promise<PuzzleDependency[]> {
    return await this.puzzleDependencyRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<PuzzleDependency> {
    const dependency = await this.puzzleDependencyRepository.findOne({ where: { id } });
    if (!dependency) {
      throw new NotFoundException(`Puzzle dependency with ID ${id} not found`);
    }
    return dependency;
  }

  async findByPuzzleId(puzzleId: string): Promise<PuzzleDependency[]> {
    return await this.puzzleDependencyRepository.find({
      where: { puzzleId },
      order: { createdAt: 'ASC' }
    });
  }

  async update(id: string, updatePuzzleDependencyDto: UpdatePuzzleDependencyDto): Promise<PuzzleDependency> {
    const dependency = await this.findOne(id);
    
    // If updating puzzle IDs, check for circular dependencies
    if (updatePuzzleDependencyDto.puzzleId || updatePuzzleDependencyDto.dependsOnPuzzleId) {
      const newPuzzleId = updatePuzzleDependencyDto.puzzleId || dependency.puzzleId;
      const newDependsOn = updatePuzzleDependencyDto.dependsOnPuzzleId || dependency.dependsOnPuzzleId;
      
      if (newPuzzleId === newDependsOn) {
        throw new BadRequestException('A puzzle cannot depend on itself');
      }

      const wouldCreateCircle = await this.wouldCreateCircularDependency(newPuzzleId, newDependsOn, id);
      if (wouldCreateCircle) {
        throw new BadRequestException('This update would create a circular reference');
      }
    }

    Object.assign(dependency, updatePuzzleDependencyDto);
    return await this.puzzleDependencyRepository.save(dependency);
  }

  async remove(id: string): Promise<void> {
    const dependency = await this.findOne(id);
    await this.puzzleDependencyRepository.remove(dependency);
  }

  async removeByPuzzleId(puzzleId: string): Promise<void> {
    await this.puzzleDependencyRepository.delete({ puzzleId });
  }

  // Eligibility and Completion Logic
  async checkEligibility(userId: string, puzzleId: string): Promise<EligibilityResult> {
    // Get all dependencies for this puzzle
    const dependencies = await this.findByPuzzleId(puzzleId);
    
    if (dependencies.length === 0) {
      return { isEligible: true, reason: 'No dependencies required' };
    }

    // Get user's completed puzzles
    const completedPuzzles = await this.getUserCompletedPuzzles(userId);
    const completedPuzzleIds = completedPuzzles.map(c => c.puzzleId);

    // Check each dependency
    const missingDependencies: string[] = [];
    const completedDependencies: string[] = [];

    for (const dependency of dependencies) {
      if (dependency.isRequired) {
        if (completedPuzzleIds.includes(dependency.dependsOnPuzzleId)) {
          completedDependencies.push(dependency.dependsOnPuzzleId);
        } else {
          missingDependencies.push(dependency.dependsOnPuzzleId);
        }
      }
    }

    const isEligible = missingDependencies.length === 0;
    
    return {
      isEligible,
      reason: isEligible 
        ? 'All required dependencies completed' 
        : `Missing required dependencies: ${missingDependencies.join(', ')}`,
      missingDependencies,
      completedDependencies
    };
  }

  async markPuzzleCompleted(userId: string, puzzleId: string): Promise<PuzzleCompletion> {
    // Check if already completed
    const existing = await this.puzzleCompletionRepository.findOne({
      where: { userId, puzzleId }
    });

    if (existing) {
      return existing; // Already completed, return existing record
    }

    const completion = this.puzzleCompletionRepository.create({
      userId,
      puzzleId,
      completedAt: new Date()
    });

    return await this.puzzleCompletionRepository.save(completion);
  }

  async getUserCompletedPuzzles(userId: string): Promise<PuzzleCompletion[]> {
    return await this.puzzleCompletionRepository.find({
      where: { userId },
      order: { completedAt: 'DESC' }
    });
  }

  async getUnlockedPuzzles(userId: string, allPuzzleIds: string[]): Promise<string[]> {
    const unlockedPuzzles: string[] = [];

    for (const puzzleId of allPuzzleIds) {
      const eligibility = await this.checkEligibility(userId, puzzleId);
      if (eligibility.isEligible) {
        unlockedPuzzles.push(puzzleId);
      }
    }

    return unlockedPuzzles;
  }

  // Utility Methods
  async getDependencyChain(puzzleId: string): Promise<DependencyChain[]> {
    const chains: DependencyChain[] = [];
    const visited = new Set<string>();

    await this.buildDependencyChain(puzzleId, 0, chains, visited);
    return chains;
  }

  private async buildDependencyChain(
    puzzleId: string, 
    level: number, 
    chains: DependencyChain[], 
    visited: Set<string>
  ): Promise<void> {
    if (visited.has(puzzleId)) return;
    visited.add(puzzleId);

    const dependencies = await this.findByPuzzleId(puzzleId);
    const dependencyIds = dependencies.map(d => d.dependsOnPuzzleId);

    chains.push({
      puzzleId,
      dependencies: dependencyIds,
      level
    });

    // Recursively build chains for dependencies
    for (const depId of dependencyIds) {
      await this.buildDependencyChain(depId, level + 1, chains, visited);
    }
  }

  private async wouldCreateCircularDependency(
    puzzleId: string, 
    dependsOnPuzzleId: string, 
    excludeId?: string
  ): Promise<boolean> {
    const visited = new Set<string>();
    return await this.hasCircularDependency(dependsOnPuzzleId, puzzleId, visited, excludeId);
  }

  private async hasCircularDependency(
    currentPuzzleId: string, 
    targetPuzzleId: string, 
    visited: Set<string>,
    excludeId?: string
  ): Promise<boolean> {
    if (visited.has(currentPuzzleId)) return false;
    if (currentPuzzleId === targetPuzzleId) return true;

    visited.add(currentPuzzleId);

    const query = this.puzzleDependencyRepository.createQueryBuilder('pd')
      .where('pd.puzzleId = :puzzleId', { puzzleId: currentPuzzleId });
    
    if (excludeId) {
      query.andWhere('pd.id != :excludeId', { excludeId });
    }

    const dependencies = await query.getMany();

    for (const dependency of dependencies) {
      if (await this.hasCircularDependency(dependency.dependsOnPuzzleId, targetPuzzleId, visited, excludeId)) {
        return true;
      }
    }

    return false;
  }

  async getPuzzleStats(puzzleId: string): Promise<{
    totalCompletions: number;
    dependencyCount: number;
    dependentPuzzleCount: number;
  }> {
    const [totalCompletions, dependencyCount, dependentPuzzleCount] = await Promise.all([
      this.puzzleCompletionRepository.count({ where: { puzzleId } }),
      this.puzzleDependencyRepository.count({ where: { puzzleId } }),
      this.puzzleDependencyRepository.count({ where: { dependsOnPuzzleId: puzzleId } })
    ]);

    return {
      totalCompletions,
      dependencyCount,
      dependentPuzzleCount
    };
  }
}