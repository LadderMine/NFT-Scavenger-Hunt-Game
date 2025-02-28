import { Injectable, NotFoundException } from "@nestjs/common"
import type { PuzzleRepository } from "../repositories/puzzle.repository"
import type { PuzzleTranslationRepository } from "../repositories/puzzle-translation.repository"
import type { LanguageRepository } from "../repositories/language.repository"
import type { PuzzleTranslation } from "../entities/puzzle-translation.entity"
import type { CreatePuzzleTranslationDto } from "../dto/create-puzzle-translation.dto"
import type { UpdatePuzzleTranslationDto } from "../dto/update-puzzle-translation.dto"
import type { CacheService } from "./cache.service"
import type { EventEmitterService } from "./event-emitter.service"

@Injectable()
export class PuzzleTranslationService {
  constructor(
    private readonly puzzleRepository: PuzzleRepository,
    private readonly puzzleTranslationRepository: PuzzleTranslationRepository,
    private readonly languageRepository: LanguageRepository,
    private readonly cacheService: CacheService,
    private readonly eventEmitter: EventEmitterService,
  ) {}

  private readonly CACHE_PREFIX = "puzzle_translation:"

  async getAllPuzzleTranslations(): Promise<PuzzleTranslation[]> {
    return this.puzzleTranslationRepository.findAll()
  }

  async getPuzzleTranslationById(id: string): Promise<PuzzleTranslation> {
    const translation = await this.puzzleTranslationRepository.findById(id)
    if (!translation) {
      throw new NotFoundException(`Puzzle translation with ID ${id} not found`)
    }
    return translation
  }

  async getPuzzleTranslation(puzzleId: string, languageCode: string): Promise<PuzzleTranslation> {
    const cacheKey = `${this.CACHE_PREFIX}${puzzleId}:${languageCode}`
    const cached = await this.cacheService.get<PuzzleTranslation>(cacheKey)

    if (cached) {
      return cached
    }

    const puzzle = await this.puzzleRepository.findById(puzzleId)
    if (!puzzle) {
      throw new NotFoundException(`Puzzle with ID ${puzzleId} not found`)
    }

    const language = await this.languageRepository.findByCode(languageCode)
    if (!language) {
      throw new NotFoundException(`Language with code ${languageCode} not found`)
    }

    const translation = await this.puzzleTranslationRepository.findByPuzzleAndLanguage(puzzle.id, language.id)

    if (!translation) {
      // If no translation exists for the requested language, try to find the default language translation
      const defaultLanguage = await this.languageRepository.findDefault()
      const defaultTranslation = await this.puzzleTranslationRepository.findByPuzzleAndLanguage(
        puzzle.id,
        defaultLanguage.id,
      )

      if (!defaultTranslation) {
        // If no default translation exists, return the puzzle with default content
        return {
          id: null,
          puzzleId: puzzle.id,
          puzzle,
          languageId: language.id,
          language,
          content: puzzle.defaultContent || {},
          isApproved: true,
          createdAt: puzzle.createdAt,
          updatedAt: puzzle.updatedAt,
        } as PuzzleTranslation
      }

      // Cache the default translation for this language
      await this.cacheService.set(cacheKey, defaultTranslation, 3600) // Cache for 1 hour
      return defaultTranslation
    }

    // Cache the translation
    await this.cacheService.set(cacheKey, translation, 3600) // Cache for 1 hour
    return translation
  }

  async getPuzzleTranslationsByLanguage(languageCode: string): Promise<PuzzleTranslation[]> {
    const language = await this.languageRepository.findByCode(languageCode)
    if (!language) {
      throw new NotFoundException(`Language with code ${languageCode} not found`)
    }

    return this.puzzleTranslationRepository.findByLanguage(language.id)
  }

  async createPuzzleTranslation(createDto: CreatePuzzleTranslationDto): Promise<PuzzleTranslation> {
    const puzzle = await this.puzzleRepository.findById(createDto.puzzleId)
    if (!puzzle) {
      throw new NotFoundException(`Puzzle with ID ${createDto.puzzleId} not found`)
    }

    const language = await this.languageRepository.findById(createDto.languageId)
    if (!language) {
      throw new NotFoundException(`Language with ID ${createDto.languageId} not found`)
    }

    // Check if translation already exists
    const existingTranslation = await this.puzzleTranslationRepository.findByPuzzleAndLanguage(puzzle.id, language.id)

    if (existingTranslation) {
      throw new Error(`Translation for puzzle ${puzzle.id} in language ${language.code} already exists`)
    }

    const newTranslation = await this.puzzleTranslationRepository.create({
      puzzleId: puzzle.id,
      languageId: language.id,
      content: createDto.content,
      isApproved: createDto.isApproved || false,
      approvedBy: createDto.approvedBy,
      approvedAt: createDto.isApproved ? new Date() : null,
      createdBy: createDto.createdBy,
      metadata: createDto.metadata,
    })

    // Invalidate cache
    await this.cacheService.delete(`${this.CACHE_PREFIX}${puzzle.id}:${language.code}`)

    // Emit event
    this.eventEmitter.emit("puzzle.translation.created", newTranslation)

    return newTranslation
  }

  async updatePuzzleTranslation(id: string, updateDto: UpdatePuzzleTranslationDto): Promise<PuzzleTranslation> {
    const translation = await this.puzzleTranslationRepository.findById(id)
    if (!translation) {
      throw new NotFoundException(`Puzzle translation with ID ${id} not found`)
    }

    const updatedTranslation = await this.puzzleTranslationRepository.update(id, {
      content: updateDto.content,
      isApproved: updateDto.isApproved,
      approvedBy: updateDto.approvedBy,
      approvedAt: updateDto.isApproved ? new Date() : translation.approvedAt,
      updatedBy: updateDto.updatedBy,
      metadata: updateDto.metadata,
    })

    // Invalidate cache
    const language = await this.languageRepository.findById(translation.languageId)
    await this.cacheService.delete(`${this.CACHE_PREFIX}${translation.puzzleId}:${language.code}`)

    // Emit event
    this.eventEmitter.emit("puzzle.translation.updated", updatedTranslation)

    return updatedTranslation
  }

  async deletePuzzleTranslation(id: string): Promise<void> {
    const translation = await this.puzzleTranslationRepository.findById(id)
    if (!translation) {
      throw new NotFoundException(`Puzzle translation with ID ${id} not found`)
    }

    // Get language before deletion for cache invalidation
    const language = await this.languageRepository.findById(translation.languageId)

    await this.puzzleTranslationRepository.remove(id)

    // Invalidate cache
    await this.cacheService.delete(`${this.CACHE_PREFIX}${translation.puzzleId}:${language.code}`)

    // Emit event
    this.eventEmitter.emit("puzzle.translation.deleted", {
      id,
      puzzleId: translation.puzzleId,
      languageCode: language.code,
    })
  }

  async approvePuzzleTranslation(id: string, approvedBy: string): Promise<PuzzleTranslation> {
    const translation = await this.puzzleTranslationRepository.findById(id)
    if (!translation) {
      throw new NotFoundException(`Puzzle translation with ID ${id} not found`)
    }

    const approvedTranslation = await this.puzzleTranslationRepository.approve(id, approvedBy)

    // Invalidate cache
    const language = await this.languageRepository.findById(translation.languageId)
    await this.cacheService.delete(`${this.CACHE_PREFIX}${translation.puzzleId}:${language.code}`)

    // Emit event
    this.eventEmitter.emit("puzzle.translation.approved", approvedTranslation)

    return approvedTranslation
  }
}

