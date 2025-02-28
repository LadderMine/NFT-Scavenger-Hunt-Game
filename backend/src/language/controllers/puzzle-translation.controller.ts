import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from "@nestjs/common"
import type { PuzzleTranslationService } from "../services/puzzle-translation.service"
import { CreatePuzzleTranslationDto } from "../dto/create-puzzle-translation.dto"
import { UpdatePuzzleTranslationDto } from "../dto/update-puzzle-translation.dto"
import { ApprovePuzzleTranslationDto } from "../dto/approve-puzzle-translation.dto"
import { LanguageGuard } from "../guards/language.guard"
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from "@nestjs/swagger"

@ApiTags("Multi-Language Puzzle")
@Controller("puzzles")
export class PuzzleTranslationController {
  constructor(private readonly puzzleTranslationService: PuzzleTranslationService) {}

  @ApiOperation({ summary: 'Get puzzle translation by ID' })
  @ApiParam({ name: 'id', description: 'Puzzle translation ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the puzzle translation with the specified ID',
  })
  @Get('translation/:id')
  async getPuzzleTranslationById(@Param('id') id: string) {
    const translation = await this.puzzleTranslationService.getPuzzleTranslationById(id);
    return {
      success: true,
      data: translation,
    };
  }

  @ApiOperation({ summary: "Get puzzle in a specific language" })
  @ApiParam({ name: "puzzleId", description: "Puzzle ID" })
  @ApiParam({ name: "languageCode", description: "Language code (e.g., en, es, fr)" })
  @ApiResponse({
    status: 200,
    description: "Returns the puzzle in the specified language",
  })
  @Get(":puzzleId/:languageCode")
  async getPuzzleTranslation(@Param('puzzleId') puzzleId: string, @Param('languageCode') languageCode: string) {
    const translation = await this.puzzleTranslationService.getPuzzleTranslation(puzzleId, languageCode)
    return {
      success: true,
      data: translation,
    }
  }

  @ApiOperation({ summary: 'Get all puzzle translations for a language' })
  @ApiParam({ name: 'languageCode', description: 'Language code (e.g., en, es, fr)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all puzzle translations for the specified language',
  })
  @Get('language/:languageCode')
  async getPuzzleTranslationsByLanguage(@Param('languageCode') languageCode: string) {
    const translations = await this.puzzleTranslationService.getPuzzleTranslationsByLanguage(languageCode);
    return {
      success: true,
      data: translations,
    };
  }

  @ApiOperation({ summary: 'Create a new puzzle translation' })
  @ApiBody({ type: CreatePuzzleTranslationDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Creates a new puzzle translation',
  })
  @Post('translate')
  @UseGuards(LanguageGuard)
  async createPuzzleTranslation(@Body() createDto: CreatePuzzleTranslationDto) {
    const translation = await this.puzzleTranslationService.createPuzzleTranslation(createDto);
    return {
      success: true,
      data: translation,
    };
  }

  @ApiOperation({ summary: "Update a puzzle translation" })
  @ApiParam({ name: "id", description: "Puzzle translation ID" })
  @ApiBody({ type: UpdatePuzzleTranslationDto })
  @ApiResponse({
    status: 200,
    description: "Updates an existing puzzle translation",
  })
  @Patch("translate/:id")
  @UseGuards(LanguageGuard)
  async updatePuzzleTranslation(@Param('id') id: string, @Body() updateDto: UpdatePuzzleTranslationDto) {
    const translation = await this.puzzleTranslationService.updatePuzzleTranslation(id, updateDto)
    return {
      success: true,
      data: translation,
    }
  }

  @ApiOperation({ summary: 'Delete a puzzle translation' })
  @ApiParam({ name: 'id', description: 'Puzzle translation ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Deletes a puzzle translation',
  })
  @Delete('translate/:id')
  @UseGuards(LanguageGuard)
  async deletePuzzleTranslation(@Param('id') id: string) {
    await this.puzzleTranslationService.deletePuzzleTranslation(id);
    return {
      success: true,
      message: 'Puzzle translation deleted successfully',
    };
  }

  @ApiOperation({ summary: "Approve a puzzle translation" })
  @ApiParam({ name: "id", description: "Puzzle translation ID" })
  @ApiBody({ type: ApprovePuzzleTranslationDto })
  @ApiResponse({
    status: 200,
    description: "Approves a puzzle translation",
  })
  @Patch("translate/:id/approve")
  @UseGuards(LanguageGuard)
  async approvePuzzleTranslation(@Param('id') id: string, @Body() approveDto: ApprovePuzzleTranslationDto) {
    const translation = await this.puzzleTranslationService.approvePuzzleTranslation(id, approveDto.approvedBy)
    return {
      success: true,
      data: translation,
    }
  }
}

