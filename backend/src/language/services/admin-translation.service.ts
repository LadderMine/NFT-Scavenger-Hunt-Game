import { Injectable, NotFoundException } from "@nestjs/common"
import type { LanguageRepository } from "../repositories/language.repository"
import type { TranslationRepository } from "../repositories/translation.repository"
import type { TranslationKeyRepository } from "../repositories/translation-key.repository"
import type { PuzzleTranslationRepository } from "../repositories/puzzle-translation.repository"
import type { Language } from "../entities/language.entity"
import type { CreateLanguageDto } from "../dto/create-language.dto"
import type { UpdateLanguageDto } from "../dto/update-language.dto"
import type { CacheService } from "./cache.service"
import type { EventEmitterService } from "./event-emitter.service"

@Injectable()
export class AdminTranslationService {
  constructor(
    private readonly languageRepository: LanguageRepository,
    private readonly translationRepository: TranslationRepository,
    private readonly translationKeyRepository: TranslationKeyRepository,
    private readonly puzzleTranslationRepository: PuzzleTranslationRepository,
    private readonly cacheService: CacheService,
    private readonly eventEmitter: EventEmitterService,
  ) {}

  async getAllLanguages(): Promise<Language[]> {
    return this.languageRepository.findAll()
  }

  async getLanguageById(id: string): Promise<Language> {
    const language = await this.languageRepository.findById(id)
    if (!language) {
      throw new NotFoundException(`Language with ID ${id} not found`)
    }
    return language
  }

  async getLanguageByCode(code: string): Promise<Language> {
    const language = await this.languageRepository.findByCode(code)
    if (!language) {
      throw new NotFoundException(`Language with code ${code} not found`)
    }
    return language
  }

  async createLanguage(createDto: CreateLanguageDto): Promise<Language> {
    // Check if language with the same code already exists
    const existingLanguage = await this.languageRepository.findByCode(createDto.code)
    if (existingLanguage) {
      throw new Error(`Language with code ${createDto.code} already exists`)
    }

    // If this is the first language, make it the default
    const languages = await this.languageRepository.findAll()
    const isDefault = languages.length === 0 ? true : createDto.isDefault

    const newLanguage = await this.languageRepository.create({
      code: createDto.code,
      name: createDto.name,
      nativeName: createDto.nativeName,
      isDefault,
      isActive: createDto.isActive !== undefined ? createDto.isActive : true,
      flagIcon: createDto.flagIcon,
      description: createDto.description,
      sortOrder: createDto.sortOrder || 0,
      metadata: createDto.metadata,
    })

    // If this language is set as default, update other languages
    if (isDefault) {
      await this.setDefaultLanguage(newLanguage.id)
    }

    // Emit event
    this.eventEmitter.emit("admin.language.created", newLanguage)

    return newLanguage
  }

  async updateLanguage(id: string, updateDto: UpdateLanguageDto): Promise<Language> {
    const language = await this.languageRepository.findById(id)
    if (!language) {
      throw new NotFoundException(`Language with ID ${id} not found`)
    }

    // If updating the code, check if it already exists
    if (updateDto.code && updateDto.code !== language.code) {
      const existingLanguage = await this.languageRepository.findByCode(updateDto.code)
      if (existingLanguage) {
        throw new Error(`Language with code ${updateDto.code} already exists`)
      }
    }

    const updatedLanguage = await this.languageRepository.update(id, {
      code: updateDto.code,
      name: updateDto.name,
      nativeName: updateDto.nativeName,
      isActive: updateDto.isActive,
      flagIcon: updateDto.flagIcon,
      description: updateDto.description,
      sortOrder: updateDto.sortOrder,
      metadata: updateDto.metadata,
    })

    // If this language is set as default, update other languages
    if (updateDto.isDefault) {
      await this.setDefaultLanguage(id)
    }

    // Clear all caches related to this language
    await this.clearLanguageCaches(language.code)

    // Emit event
    this.eventEmitter.emit("admin.language.updated", updatedLanguage)

    return updatedLanguage
  }

  async deleteLanguage(id: string): Promise<void> {
    const language = await this.languageRepository.findById(id)
    if (!language) {
      throw new NotFoundException(`Language with ID ${id} not found`)
    }

    // Don't allow deleting the default language
    if (language.isDefault) {
      throw new Error("Cannot delete the default language")
    }

    // Clear all caches related to this language
    await this.clearLanguageCaches(language.code)

    // Delete the language (cascading delete will remove related translations)
    await this.languageRepository.remove(id)

    // Emit event
    this.eventEmitter.emit("admin.language.deleted", { id, code: language.code })
  }

  async setDefaultLanguage(id: string): Promise<Language> {
    const language = await this.languageRepository.findById(id)
    if (!language) {
      throw new NotFoundException(`Language with ID ${id} not found`)
    }

    // Set this language as default and all others as non-default
    const updatedLanguage = await this.languageRepository.setDefault(id)

    // Clear all caches
    await this.cacheService.clear()

    // Emit event
    this.eventEmitter.emit("admin.language.setDefault", updatedLanguage)

    return updatedLanguage
  }

  async getTranslationStats(): Promise<any> {
    const languages = await this.languageRepository.findAll()
    const translationKeys = await this.translationKeyRepository.findAll()

    const stats = []

    for (const language of languages) {
      const translations = await this.translationRepository.findByLanguage(language.id)

      stats.push({
        language: {
          id: language.id,
          code: language.code,
          name: language.name,
        },
        totalKeys: translationKeys.length,
        translatedKeys: translations.length,
        missingKeys: translationKeys.length - translations.length,
        completionPercentage: Math.round((translations.length / translationKeys.length) * 100),
      })
    }

    return stats
  }

  private async clearLanguageCaches(languageCode: string): Promise<void> {
    // Clear translation caches
    await this.cacheService.delete(`translations:${languageCode}`)

    // Clear category caches
    const categories = await this.translationKeyRepository.findAll()
    const uniqueCategories = [...new Set(categories.map((key) => key.category))]

    for (const category of uniqueCategories) {
      await this.cacheService.delete(`translations:${languageCode}:${category}`)
    }

    // Clear puzzle translation caches
    const puzzleTranslations = await this.puzzleTranslationRepository.findByLanguage(
      (await this.languageRepository.findByCode(languageCode)).id,
    )

    for (const translation of puzzleTranslations) {
      await this.cacheService.delete(`puzzle_translation:${translation.puzzleId}:${languageCode}`)
    }

    // Clear user language caches (will be regenerated on next request)
    const cacheKeys = await this.cacheService.keys("user_language:*")
    for (const key of cacheKeys) {
      await this.cacheService.delete(key)
    }
  }
}

