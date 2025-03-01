import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from "@nestjs/common"
import type { TranslationService } from "../services/translation.service"
import { CreateTranslationDto } from "../dto/create-translation.dto"
import { UpdateTranslationDto } from "../dto/update-translation.dto"
import { BulkCreateTranslationDto } from "../dto/bulk-create-translation.dto"
import { LanguageGuard } from "../guards/language.guard"
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from "@nestjs/swagger"

@ApiTags("Content Translation")
@Controller("translations")
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @ApiOperation({ summary: 'Get all translations for a language' })
  @ApiParam({ name: 'languageCode', description: 'Language code (e.g., en, es, fr)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all translations for the specified language',
  })
  @Get(':languageCode')
  async getTranslationsByLanguage(@Param('languageCode') languageCode: string) {
    const translations = await this.translationService.getTranslationsByLanguage(languageCode);
    return {
      success: true,
      data: translations,
    };
  }

  @ApiOperation({ summary: "Get translations by category for a language" })
  @ApiParam({ name: "languageCode", description: "Language code (e.g., en, es, fr)" })
  @ApiParam({ name: "category", description: "Translation category (e.g., UI, Puzzle, Hint)" })
  @ApiResponse({
    status: 200,
    description: "Returns translations for the specified language and category",
  })
  @Get(":languageCode/category/:category")
  async getTranslationsByCategory(@Param('languageCode') languageCode: string, @Param('category') category: string) {
    const translations = await this.translationService.getTranslationsByCategory(languageCode, category)
    return {
      success: true,
      data: translations,
    }
  }

  @ApiOperation({ summary: 'Create a new translation' })
  @ApiBody({ type: CreateTranslationDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Creates a new translation',
  })
  @Post()
  @UseGuards(LanguageGuard)
  async createTranslation(@Body() createDto: CreateTranslationDto) {
    const translation = await this.translationService.createTranslation(createDto);
    return {
      success: true,
      data: translation,
    };
  }

  @ApiOperation({ summary: "Update a translation" })
  @ApiParam({ name: "id", description: "Translation ID" })
  @ApiBody({ type: UpdateTranslationDto })
  @ApiResponse({
    status: 200,
    description: "Updates an existing translation",
  })
  @Patch(":id")
  @UseGuards(LanguageGuard)
  async updateTranslation(@Param('id') id: string, @Body() updateDto: UpdateTranslationDto) {
    const translation = await this.translationService.updateTranslation(id, updateDto)
    return {
      success: true,
      data: translation,
    }
  }

  @ApiOperation({ summary: 'Delete a translation' })
  @ApiParam({ name: 'id', description: 'Translation ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Deletes a translation',
  })
  @Delete(':id')
  @UseGuards(LanguageGuard)
  async deleteTranslation(@Param('id') id: string) {
    await this.translationService.deleteTranslation(id);
    return {
      success: true,
      message: 'Translation deleted successfully',
    };
  }

  @ApiOperation({ summary: 'Bulk create translations' })
  @ApiBody({ type: BulkCreateTranslationDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Creates multiple translations at once',
  })
  @Post('bulk')
  @UseGuards(LanguageGuard)
  async bulkCreateTranslations(@Body() bulkDto: BulkCreateTranslationDto) {
    const translations = await this.translationService.bulkCreateTranslations(bulkDto.translations);
    return {
      success: true,
      data: translations,
    };
  }
}

