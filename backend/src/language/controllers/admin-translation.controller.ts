import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from "@nestjs/common"
import type { AdminTranslationService } from "../services/admin-translation.service"
import { CreateLanguageDto } from "../dto/create-language.dto"
import { UpdateLanguageDto } from "../dto/update-language.dto"
import { LanguageGuard } from "../guards/language.guard"
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from "@nestjs/swagger"

@ApiTags("Admin Translation Management")
@Controller("admin/translations")
@UseGuards(LanguageGuard)
export class AdminTranslationController {
  constructor(private readonly adminTranslationService: AdminTranslationService) {}

  @ApiOperation({ summary: "Get all languages" })
  @ApiResponse({
    status: 200,
    description: "Returns all available languages",
  })
  @Get("languages")
  async getAllLanguages() {
    const languages = await this.adminTranslationService.getAllLanguages()
    return {
      success: true,
      data: languages,
    }
  }

  @ApiOperation({ summary: 'Get language by ID' })
  @ApiParam({ name: 'id', description: 'Language ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the language with the specified ID',
  })
  @Get('languages/:id')
  async getLanguageById(@Param('id') id: string) {
    const language = await this.adminTranslationService.getLanguageById(id);
    return {
      success: true,
      data: language,
    };
  }

  @ApiOperation({ summary: 'Get language by code' })
  @ApiParam({ name: 'code', description: 'Language code (e.g., en, es, fr)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the language with the specified code',
  })
  @Get('languages/code/:code')
  async getLanguageByCode(@Param('code') code: string) {
    const language = await this.adminTranslationService.getLanguageByCode(code);
    return {
      success: true,
      data: language,
    };
  }

  @ApiOperation({ summary: 'Create a new language' })
  @ApiBody({ type: CreateLanguageDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Creates a new language',
  })
  @Post('languages')
  async createLanguage(@Body() createDto: CreateLanguageDto) {
    const language = await this.adminTranslationService.createLanguage(createDto);
    return {
      success: true,
      data: language,
    };
  }

  @ApiOperation({ summary: "Update a language" })
  @ApiParam({ name: "id", description: "Language ID" })
  @ApiBody({ type: UpdateLanguageDto })
  @ApiResponse({
    status: 200,
    description: "Updates an existing language",
  })
  @Patch("languages/:id")
  async updateLanguage(@Param('id') id: string, @Body() updateDto: UpdateLanguageDto) {
    const language = await this.adminTranslationService.updateLanguage(id, updateDto)
    return {
      success: true,
      data: language,
    }
  }

  @ApiOperation({ summary: 'Delete a language' })
  @ApiParam({ name: 'id', description: 'Language ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Deletes a language',
  })
  @Delete('languages/:id')
  async deleteLanguage(@Param('id') id: string) {
    await this.adminTranslationService.deleteLanguage(id);
    return {
      success: true,
      message: 'Language deleted successfully',
    };
  }

  @ApiOperation({ summary: 'Set a language as default' })
  @ApiParam({ name: 'id', description: 'Language ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Sets the specified language as the default language',
  })
  @Patch('languages/:id/default')
  async setDefaultLanguage(@Param('id') id: string) {
    const language = await this.adminTranslationService.setDefaultLanguage(id);
    return {
      success: true,
      data: language,
    };
  }

  @ApiOperation({ summary: "Get translation statistics" })
  @ApiResponse({
    status: 200,
    description: "Returns statistics about translations for all languages",
  })
  @Get("stats")
  async getTranslationStats() {
    const stats = await this.adminTranslationService.getTranslationStats()
    return {
      success: true,
      data: stats,
    }
  }
}

