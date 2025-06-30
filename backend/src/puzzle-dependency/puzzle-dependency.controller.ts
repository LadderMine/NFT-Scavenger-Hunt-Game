import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  HttpStatus,
  ParseUUIDPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PuzzleDependencyService } from './puzzle-dependency.service';
import { CreatePuzzleDependencyDto } from './dto/create-puzzle-dependency.dto';
import { UpdatePuzzleDependencyDto } from './dto/update-puzzle-dependency.dto';
import { CheckEligibilityDto } from './dto/check-eligibility.dto';
import { MarkCompletionDto } from './dto/mark-completion.dto';

@ApiTags('Puzzle Dependencies')
@Controller('puzzle-dependencies')
export class PuzzleDependencyController {
  constructor(private readonly puzzleDependencyService: PuzzleDependencyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new puzzle dependency' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Dependency created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input or circular dependency' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Dependency already exists' })
  create(@Body() createPuzzleDependencyDto: CreatePuzzleDependencyDto) {
    return this.puzzleDependencyService.create(createPuzzleDependencyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all puzzle dependencies' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Dependencies retrieved successfully' })
  findAll() {
    return this.puzzleDependencyService.findAll();
  }

  @Get('puzzle/:puzzleId')
  @ApiOperation({ summary: 'Get dependencies for a specific puzzle' })
  @ApiParam({ name: 'puzzleId', description: 'Puzzle ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Dependencies retrieved successfully' })
  findByPuzzleId(@Param('puzzleId') puzzleId: string) {
    return this.puzzleDependencyService.findByPuzzleId(puzzleId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific puzzle dependency' })
  @ApiParam({ name: 'id', description: 'Dependency ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Dependency retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Dependency not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.puzzleDependencyService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a puzzle dependency' })
  @ApiParam({ name: 'id', description: 'Dependency ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Dependency updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Dependency not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid update or circular dependency' })
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updatePuzzleDependencyDto: UpdatePuzzleDependencyDto
  ) {
    return this.puzzleDependencyService.update(id, updatePuzzleDependencyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a puzzle dependency' })
  @ApiParam({ name: 'id', description: 'Dependency ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Dependency deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Dependency not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.puzzleDependencyService.remove(id);
  }

  @Delete('puzzle/:puzzleId')
  @ApiOperation({ summary: 'Delete all dependencies for a puzzle' })
  @ApiParam({ name: 'puzzleId', description: 'Puzzle ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Dependencies deleted successfully' })
  removeByPuzzleId(@Param('puzzleId') puzzleId: string) {
    return this.puzzleDependencyService.removeByPuzzleId(puzzleId);
  }

  // Eligibility and Completion Endpoints
  @Post('check-eligibility')
  @ApiOperation({ summary: 'Check if a user is eligible to access a puzzle' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Eligibility checked successfully' })
  checkEligibility(@Body() checkEligibilityDto: CheckEligibilityDto) {
    return this.puzzleDependencyService.checkEligibility(
      checkEligibilityDto.userId,
      checkEligibilityDto.puzzleId
    );
  }

  @Post('mark-completed')
  @ApiOperation({ summary: 'Mark a puzzle as completed for a user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Puzzle completion recorded' })
  markCompleted(@Body() markCompletionDto: MarkCompletionDto) {
    return this.puzzleDependencyService.markPuzzleCompleted(
      markCompletionDto.userId,
      markCompletionDto.puzzleId
    );
  }

  @Get('user/:userId/completed')
  @ApiOperation({ summary: 'Get all puzzles completed by a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Completed puzzles retrieved successfully' })
  getUserCompletedPuzzles(@Param('userId') userId: string) {
    return this.puzzleDependencyService.getUserCompletedPuzzles(userId);
  }

  @Get('user/:userId/unlocked')
  @ApiOperation({ summary: 'Get all puzzles unlocked for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'puzzleIds', description: 'Comma-separated list of all puzzle IDs', required: true })
  @ApiResponse({ status: HttpStatus.OK, description: 'Unlocked puzzles retrieved successfully' })
  getUnlockedPuzzles(
    @Param('userId') userId: string,
    @Query('puzzleIds') puzzleIds: string
  ) {
    const puzzleIdArray = puzzleIds.split(',').filter(id => id.trim());
    return this.puzzleDependencyService.getUnlockedPuzzles(userId, puzzleIdArray);
  }

  @Get('chain/:puzzleId')
  @ApiOperation({ summary: 'Get the complete dependency chain for a puzzle' })
  @ApiParam({ name: 'puzzleId', description: 'Puzzle ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Dependency chain retrieved successfully' })
  getDependencyChain(@Param('puzzleId') puzzleId: string) {
    return this.puzzleDependencyService.getDependencyChain(puzzleId);
  }

  @Get('stats/:puzzleId')
  @ApiOperation({ summary: 'Get statistics for a puzzle' })
  @ApiParam({ name: 'puzzleId', description: 'Puzzle ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Puzzle statistics retrieved successfully' })
  getPuzzleStats(@Param('puzzleId') puzzleId: string) {
    return this.puzzleDependencyService.getPuzzleStats(puzzleId);
  }
}