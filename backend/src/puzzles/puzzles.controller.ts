import { 
    BadRequestException, 
    Body, 
    Controller, 
    NotFoundException, 
    ParseIntPipe, 
    Patch, 
    Post, 
    Param 
  } from '@nestjs/common';
  import { validate } from 'class-validator';
  import { CreatePuzzleDto } from './dtos/createPuzzles.dto';
  import { UpdatePuzzleDto } from './dtos/update-puzzle.dto';
  import { PuzzlesService } from './puzzles.service';
  
  @Controller('puzzles')
  export class PuzzlesController {
    constructor(private readonly puzzleService: PuzzlesService) {}
  
    @Post()
    async create(@Body() createPuzzleDto: CreatePuzzleDto) {
      // Manual validation (or use a global validation pipe)
      const errors = await validate(createPuzzleDto);
      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }
      return this.puzzleService.createPuzzle(createPuzzleDto.level);
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
  }
  