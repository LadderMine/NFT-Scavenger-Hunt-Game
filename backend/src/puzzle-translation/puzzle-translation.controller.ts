import { Controller, Get, Post, Body, Param, Put, Query, Req } from '@nestjs/common';
import { PuzzleTranslationService } from './puzzle-translation.service';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';

@Controller('puzzle-translations')
export class PuzzleTranslationController {
  constructor(private readonly service: PuzzleTranslationService) {}

  @Post()
  create(@Body() dto: CreateTranslationDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTranslationDto) {
    return this.service.update(+id, dto);
  }

  @Get(':puzzleId')
  findTranslations(@Param('puzzleId') puzzleId: string) {
    return this.service.findAll(puzzleId);
  }

  @Get(':puzzleId/lang')
  findByLang(
    @Param('puzzleId') puzzleId: string,
    @Query('lang') lang: string,
    @Req() req,
  ) {
    const language = lang || req.headers['accept-language']?.split(',')[0] || 'en';
    return this.service.findByPuzzleAndLanguage(puzzleId, language);
  }
} 