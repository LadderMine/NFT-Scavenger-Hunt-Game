import { 
    BadRequestException, 
    Body, 
    Controller, 
    NotFoundException, 
    ParseIntPipe, 
    Patch, 
    Post, 
    Param, 
    UseGuards,
    Delete,
    HttpCode
  } from '@nestjs/common';
  import { validate } from 'class-validator';
  import { CreatePuzzleDto } from './dtos/createPuzzles.dto';
  import { UpdatePuzzleDto } from './dtos/update-puzzle.dto';
  import { PuzzlesService } from './puzzles.service';
import { AdminGuard } from 'src/articles/guards/admin.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
  
  @Controller('puzzles')
  export class PuzzlesController {
    constructor(
      private readonly puzzleService: PuzzlesService,
    ) {}
  
    @Post()
    async create(@Body() createPuzzleDto: CreatePuzzleDto) {
      // Manual validation (or use a global validation pipe)
      const errors = await validate(createPuzzleDto);
      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }
      return this.puzzleService.createPuzzle(createPuzzleDto);
    }
  
    @Patch(':id')
    async updatePuzzle(
      @Param('id', ParseIntPipe) id: number,
      @Body() updatePuzzleDto: UpdatePuzzleDto
    ) {
      const updatedPuzzle = await this.puzzleService.updatePuzzle(id, updatePuzzleDto);
      if (!updatedPuzzle) {
        throw new NotFoundException(`Puzzle with ID ${id} not found`);
      }
      return updatedPuzzle;
    }

    @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a puzzle (Admin only)' })
  @ApiResponse({ status: 200, description: 'Puzzle deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Puzzle not found.' })
  @HttpCode(200)
  async deletePuzzle(@Param('id') id: string) {
    await this.puzzleService.deletePuzzle(id);
    return { message: 'Puzzle deleted successfully.' };
  }
  }
  