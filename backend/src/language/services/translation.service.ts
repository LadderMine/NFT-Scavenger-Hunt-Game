import { Injectable, NotFoundException } from "@nestjs/common"
import type { TranslationRepository } from "../repositories/translation.repository"
import type { TranslationKeyRepository } from "../repositories/translation-key.repository"
import type { LanguageRepository } from "../repositories/language.repository"
import type { Translation } from "../entities/translation.entity"
import type { CreateTranslationDto } from "../dto/create-translation.dto"
import type { UpdateTranslationDto } from "../dto/update-translation.dto"
import type { CacheService } from "./cache.service"
import type { EventEmitterService } from "./event-emitter.service"

@Injectable()
export class TranslationService {
  constructor(
    private readonly translationRepository: TranslationRepository,
    private readonly translationKeyRepository: TranslationKeyRepository,
    private readonly languageRepository: LanguageRepository,
    private readonly cacheService: CacheService,
    private readonly eventEmitter: EventEmitterService,
  ) {}

  private readonly CACHE_PREFIX = "translations:"

  async getAllTranslations(): Promise<Translation[]> {
    return this.translationRepository.findAll()
  }

  async getTranslationById(id: string): Promise<Translation> {
    const translation = await this.translationRepository.findById(id)
    if (!translation) {
      throw new NotFoundException(`Translation with ID ${id} not found`)
    }
    return translation
  }

  async getTranslationsByLanguage(languageCode: string): Promise<Record<string, string>> {
    const cacheKey = `${this.CACHE_PREFIX}${languageCode}`
    const cached = await this.cacheService.get<Record<string, string>>(cacheKey)

    if (cached) {
      return cached
    }

    const language = await this.languageRepository.findByCode(languageCode)
    if (!language) {
      throw new NotFoundException(`Language with code ${languageCode} not found`)
    }

    const translations = await this.translationRepository.findByLanguage(language.id)

    // Convert to key-value format
    const result: Record<string, string> = {}
    for (const translation of translations) {
      result[translation.translationKey.key] = translation.value
    }

    // Cache for 1 hour
    await this.cacheService.set(cacheKey, result, 3600)

    return result
  }

  async getTranslationsByCategory(languageCode: string, category: string): Promise<Record<string, string>> {
    const cacheKey = `${this.CACHE_PREFIX}${languageCode}:${category}`
    const cached = await this.cacheService.get<Record<string, string>>(cacheKey)

    if (cached) {
      return cached
    }

    const language = await this.languageRepository.findByCode(languageCode)
    if (!language) {
      throw new NotFoundException(`Language with code ${languageCode} not found`)
    }

    const translations = await this.translationRepository.findByCategory(language.id, category)

    // Convert to key-value format
    const result: Record<string, string> = {}
    for (const translation of translations) {
      result[translation.translationKey.key] = translation.value
    }

    // Cache for 1 hour
    await this.cacheService.set(cacheKey, result, 3600)

    return result
  }

  async createTranslation(createDto: CreateTranslationDto): Promise<Translation> {
    const language = await this.languageRepository.findById(createDto.languageId)
    if (!language) {
      throw new NotFoundException(`Language with ID ${createDto.languageId} not found`)
    }

    let translationKey = await this.translationKeyRepository.findByKey(createDto.key)

    if (!translationKey) {
      // Create a new translation key if it doesn't exist
      translationKey = await this.translationKeyRepository.create({
        key: createDto.key,
        category: createDto.category,
        description: createDto.description,
        defaultValue: createDto.defaultValue,
      })
    }

    // Check if translation already exists
    const existingTranslation = await this.translationRepository.findByLanguageAndKey(language.id, translationKey.id)

    if (existingTranslation) {
      throw new Error(`Translation for key ${createDto.key} in language ${language.code} already exists`)
    }

    const newTranslation = await this.translationRepository.create({
      languageId: language.id,
      translationKeyId: translationKey.id,
      value: createDto.value,
      isApproved: createDto.isApproved || false,
      approvedBy: createDto.approvedBy,
      approvedAt: createDto.isApproved ? new Date() : null,
      createdBy: createDto.createdBy,
      metadata: createDto.metadata,
    })

    // Invalidate cache
    await this.cacheService.delete(`${this.CACHE_PREFIX}${language.code}`)
    await this.cacheService.delete(`${this.CACHE_PREFIX}${language.code}:${translationKey.category}`)

    // Emit event
    this.eventEmitter.emit("translation.created", newTranslation)

    return newTranslation
  }

  async updateTranslation(id: string, updateDto: UpdateTranslationDto): Promise<Translation> {
    const translation = await this.translationRepository.findById(id)
    if (!translation) {
      throw new NotFoundException(`Translation with ID ${id} not found`)
    }

    const updatedTranslation = await this.translationRepository.update(id, {
      value: updateDto.value,
      isApproved: updateDto.isApproved,
      approvedBy: updateDto.approvedBy,
      approvedAt: updateDto.isApproved ? new Date() : translation.approvedAt,
      updatedBy: updateDto.updatedBy,
      metadata: updateDto.metadata,
    })

    // Invalidate cache
    const language = await this.languageRepository.findById(translation.languageId)
    const translationKey = await this.translationKeyRepository.findById(translation.translationKeyId)

    await this.cacheService.delete(`${this.CACHE_PREFIX}${language.code}`)
    await this.cacheService.delete(`${this.CACHE_PREFIX}${language.code}:${translationKey.category}`)

    // Emit event
    this.eventEmitter.emit("translation.updated", updatedTranslation)

    return updatedTranslation
  }

  async deleteTranslation(id: string): Promise<void> {
    const translation = await this.translationRepository.findById(id)
    if (!translation) {
      throw new NotFoundException(`Translation with ID ${id} not found`)
    }

    // Get language and category before deletion for cache invalidation
    const language = await this.languageRepository.findById(translation.languageId)
    const translationKey = await this.translationKeyRepository.findById(translation.translationKeyId)

    await this.translationRepository.remove(id)

    // Invalidate cache
    await this.cacheService.delete(`${this.CACHE_PREFIX}${language.code}`)
    await this.cacheService.delete(`${this.CACHE_PREFIX}${language.code}:${translationKey.category}`)

    // Emit event
    this.eventEmitter.emit("translation.deleted", { id, languageCode: language.code })
  }

  async bulkCreateTranslations(createDtos: CreateTranslationDto[]): Promise<Translation[]> {
    const translations: Partial<Translation>[] = []
    const languageCodes = new Set<string>()
    const categories = new Set<string>()

    for (const dto of createDtos) {
      const language = await this.languageRepository.findById(dto.languageId)
      if (!language) {
        throw new NotFoundException(`Language with ID ${dto.languageId} not found`)
      }

      languageCodes.add(language.code)

      let translationKey = await this.translationKeyRepository.findByKey(dto.key)

      if (!translationKey) {
        // Create a new translation key if it doesn't exist
        translationKey = await this.translationKeyRepository.create({
          key: dto.key,
          category: dto.category,
          description: dto.description,
          defaultValue: dto.defaultValue,
        })
      }

      categories.add(translationKey.category)

      translations.push({
        languageId: language.id,
        translationKeyId: translationKey.id,
        value: dto.value,
        isApproved: dto.isApproved || false,
        approvedBy: dto.approvedBy,
        approvedAt: dto.isApproved ? new Date() : null,
        createdBy: dto.createdBy,
        metadata: dto.metadata,
      })
    }

    const createdTranslations = await this.translationRepository.bulkCreate(translations)

    // Invalidate cache
    for (const code of languageCodes) {
      await this.cacheService.delete(`${this.CACHE_PREFIX}${code}`)

      for (const category of categories) {
        await this.cacheService.delete(`${this.CACHE_PREFIX}${code}:${category}`)
      }
    }

    // Emit event
    this.eventEmitter.emit("translation.bulkCreated", createdTranslations)

    return createdTranslations
  }
}

