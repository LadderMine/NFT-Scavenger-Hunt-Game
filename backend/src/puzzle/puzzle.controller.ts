import {
  Controller, Post, Get, Patch, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PuzzleService } from './puzzle.service';
import { CreatePuzzleDto } from './dto/create-puzzle.dto';
import { UpdatePuzzleDto } from './dto/update-puzzle.dto';
// import { AdminAuthGuard } from '../auth/admin-auth.guard'; // Placeholder for admin guard

@ApiTags('Puzzles')
@Controller()
export class PuzzleController {
  constructor(private readonly puzzleService: PuzzleService) {}

  @Post('admin/puzzles')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new puzzle (admin)' })
  @ApiResponse({ status: 201, description: 'Puzzle created.' })
  // @UseGuards(AdminAuthGuard)
  create(@Body() createPuzzleDto: CreatePuzzleDto) {
    return this.puzzleService.create(createPuzzleDto);
  }

  @Get('admin/puzzles')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all puzzles (admin)' })
  @ApiResponse({ status: 200, description: 'List of puzzles.' })
  // @UseGuards(AdminAuthGuard)
  findAllAdmin() {
    return this.puzzleService.findAllAdmin();
  }

  @Get('admin/puzzles/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get puzzle by ID (admin)' })
  @ApiResponse({ status: 200, description: 'Puzzle found.' })
  // @UseGuards(AdminAuthGuard)
  findOneAdmin(@Param('id') id: string) {
    return this.puzzleService.findOneAdmin(id);
  }

  @Patch('admin/puzzles/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update puzzle by ID (admin)' })
  @ApiResponse({ status: 200, description: 'Puzzle updated.' })
  // @UseGuards(AdminAuthGuard)
  update(@Param('id') id: string, @Body() updatePuzzleDto: UpdatePuzzleDto) {
    return this.puzzleService.update(id, updatePuzzleDto);
  }

  @Delete('admin/puzzles/:id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete puzzle by ID (admin)' })
  @ApiResponse({ status: 204, description: 'Puzzle deleted.' })
  // @UseGuards(AdminAuthGuard)
  remove(@Param('id') id: string) {
    return this.puzzleService.remove(id);
  }

  @Get('puzzles/active')
  @ApiOperation({ summary: 'Get active puzzles (public)' })
  @ApiQuery({ name: 'difficulty', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of active puzzles.' })
  findActive(@Query('difficulty') difficulty?: string) {
    return this.puzzleService.findActive(difficulty);
  }
}
