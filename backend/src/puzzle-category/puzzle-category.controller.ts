import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  ParseIntPipe,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PuzzleCategoryService } from './puzzle-category.service';
import { 
  CreateCategoryDto, 
  UpdateCategoryDto, 
  CreatePuzzleDto, 
  UpdatePuzzleDto,
  PuzzlesByCategoryResponseDto,
  CategoryResponseDto,
  PuzzleResponseDto
} from './dto/puzzle-category.dto';

@ApiTags('Puzzle Categories')
@Controller('puzzle-categories')
export class PuzzleCategoryController {
  constructor(private readonly puzzleCategoryService: PuzzleCategoryService) {}

  /**
   * GET /puzzles-by-category - Main endpoint requested in the task
   * Returns puzzles grouped under each category
   */
  @Get('puzzles-by-category')
  @ApiOperation({ 
    summary: 'Get puzzles grouped by categories',
    description: 'Fetch all puzzles organized by their categories. This helps users discover puzzles based on their interests or skill levels.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Puzzles successfully grouped by categories',
    type: [PuzzlesByCategoryResponseDto]
  })
  async getPuzzlesByCategory(): Promise<PuzzlesByCategoryResponseDto[]> {
    return this.puzzleCategoryService.getPuzzlesByCategory();
  }

  // Category endpoints
  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ 
    status: 200, 
    description: 'All categories retrieved successfully',
    type: [CategoryResponseDto]
  })
  async getAllCategories(): Promise<CategoryResponseDto[]> {
    return this.puzzleCategoryService.getAllCategories();
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Category retrieved successfully',
    type: CategoryResponseDto
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getCategoryById(@Param('id', ParseIntPipe) id: number): Promise<CategoryResponseDto> {
    return this.puzzleCategoryService.getCategoryById(id);
  }

  @Get('categories/slug/:slug')
  @ApiOperation({ summary: 'Get category by slug' })
  @ApiParam({ name: 'slug', description: 'Category slug' })
  @ApiResponse({ 
    status: 200, 
    description: 'Category retrieved successfully',
    type: CategoryResponseDto
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getCategoryBySlug(@Param('slug') slug: string): Promise<CategoryResponseDto> {
    return this.puzzleCategoryService.getCategoryBySlug(slug);
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ 
    status: 201, 
    description: 'Category created successfully',
    type: CategoryResponseDto
  })
  @HttpCode(HttpStatus.CREATED)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.puzzleCategoryService.createCategory(createCategoryDto);
  }

  @Put('categories/:id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Category updated successfully',
    type: CategoryResponseDto
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<CategoryResponseDto> {
    return this.puzzleCategoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete a category (soft delete)' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.puzzleCategoryService.deleteCategory(id);
  }

  // Puzzle endpoints
  @Get('puzzles')
  @ApiOperation({ summary: 'Get all puzzles' })
  @ApiResponse({ 
    status: 200, 
    description: 'All puzzles retrieved successfully',
    type: [PuzzleResponseDto]
  })
  async getAllPuzzles(): Promise<PuzzleResponseDto[]> {
    return this.puzzleCategoryService.getAllPuzzles();
  }

  @Get('puzzles/:id')
  @ApiOperation({ summary: 'Get puzzle by ID' })
  @ApiParam({ name: 'id', description: 'Puzzle ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Puzzle retrieved successfully',
    type: PuzzleResponseDto
  })
  @ApiResponse({ status: 404, description: 'Puzzle not found' })
  async getPuzzleById(@Param('id', ParseIntPipe) id: number): Promise<PuzzleResponseDto> {
    return this.puzzleCategoryService.getPuzzleById(id);
  }

  @Post('puzzles')
  @ApiOperation({ summary: 'Create a new puzzle' })
  @ApiResponse({ 
    status: 201, 
    description: 'Puzzle created successfully',
    type: PuzzleResponseDto
  })
  @HttpCode(HttpStatus.CREATED)
  async createPuzzle(@Body() createPuzzleDto: CreatePuzzleDto): Promise<PuzzleResponseDto> {
    return this.puzzleCategoryService.createPuzzle(createPuzzleDto);
  }

  @Put('puzzles/:id')
  @ApiOperation({ summary: 'Update a puzzle' })
  @ApiParam({ name: 'id', description: 'Puzzle ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Puzzle updated successfully',
    type: PuzzleResponseDto
  })
  @ApiResponse({ status: 404, description: 'Puzzle not found' })
  async updatePuzzle(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePuzzleDto: UpdatePuzzleDto
  ): Promise<PuzzleResponseDto> {
    return this.puzzleCategoryService.updatePuzzle(id, updatePuzzleDto);
  }

  @Delete('puzzles/:id')
  @ApiOperation({ summary: 'Delete a puzzle (soft delete)' })
  @ApiParam({ name: 'id', description: 'Puzzle ID' })
  @ApiResponse({ status: 200, description: 'Puzzle deleted successfully' })
  @ApiResponse({ status: 404, description: 'Puzzle not found' })
  async deletePuzzle(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.puzzleCategoryService.deletePuzzle(id);
  }

  // Additional utility endpoints
  @Get('categories/:id/puzzles')
  @ApiOperation({ summary: 'Get puzzles by category ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Puzzles for category retrieved successfully',
    type: [PuzzleResponseDto]
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getPuzzlesByCategoryId(@Param('id', ParseIntPipe) categoryId: number): Promise<PuzzleResponseDto[]> {
    return this.puzzleCategoryService.getPuzzlesByCategoryId(categoryId);
  }

  @Get('puzzles/difficulty/:difficulty')
  @ApiOperation({ summary: 'Get puzzles by difficulty level' })
  @ApiParam({ 
    name: 'difficulty', 
    description: 'Difficulty level',
    enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Puzzles by difficulty retrieved successfully',
    type: [PuzzleResponseDto]
  })
  async getPuzzlesByDifficulty(@Param('difficulty') difficulty: string): Promise<PuzzleResponseDto[]> {
    return this.puzzleCategoryService.getPuzzlesByDifficulty(difficulty);
  }

  @Get('puzzles/search')
  @ApiOperation({ summary: 'Search puzzles by title or description' })
  @ApiQuery({ name: 'q', description: 'Search term' })
  @ApiResponse({ 
    status: 200, 
    description: 'Search results retrieved successfully',
    type: [PuzzleResponseDto]
  })
  async searchPuzzles(@Query('q') searchTerm: string): Promise<PuzzleResponseDto[]> {
    return this.puzzleCategoryService.searchPuzzles(searchTerm);
  }

  // Admin endpoint for seeding initial data
  @Post('seed-categories')
  @ApiOperation({ 
    summary: 'Seed initial categories',
    description: 'Create initial categories for the NFT Scavenger Hunt game. This endpoint should only be called once during setup.'
  })
  @ApiResponse({ status: 201, description: 'Initial categories seeded successfully' })
  @HttpCode(HttpStatus.CREATED)
  async seedInitialCategories(): Promise<{ message: string }> {
    await this.puzzleCategoryService.seedInitialCategories();
    return { message: 'Initial categories seeded successfully' };
  }
} 