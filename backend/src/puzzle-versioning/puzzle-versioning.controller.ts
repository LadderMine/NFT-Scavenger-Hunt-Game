import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { PuzzleVersioningService } from './puzzle-versioning.service';
import { CreatePuzzleVersionDto } from './dto/create-puzzle-version.dto';

@Controller('puzzles')
export class PuzzleVersioningController {
  constructor(private readonly puzzleVersioningService: PuzzleVersioningService) {}

  
  @Get(':puzzleId/latest')
  findLatestVersion(@Param('puzzleId') puzzleId: string) {
    return this.puzzleVersioningService.findLatestVersion(puzzleId);
  }
  
  
  @Post('versions')
  @UsePipes(new ValidationPipe({ transform: true }))
  createNewVersion(@Body() createPuzzleVersionDto: CreatePuzzleVersionDto) {
    return this.puzzleVersioningService.createNewVersion(createPuzzleVersionDto);
  }
  
  @Get(':puzzleId/versions')
  findAllVersions(@Param('puzzleId') puzzleId: string) {
    return this.puzzleVersioningService.findAllVersions(puzzleId);
  }
}