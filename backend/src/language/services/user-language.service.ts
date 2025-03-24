import { Injectable, NotFoundException } from "@nestjs/common"
import type { UserLanguageRepository } from "../repositories/user-language.repository"
import type { LanguageRepository } from "../repositories/language.repository"
import type { UserLanguagePreference } from "../entities/user-language-preference.entity"
import type { CreateUserLanguageDto } from "../dto/create-user-language.dto"
import type { UpdateUserLanguageDto } from "../dto/update-user-language.dto"
import type { CacheService } from "./cache.service"
import type { EventEmitterService } from "./event-emitter.service"

@Injectable()
export class UserLanguageService {
  constructor(
    private readonly userLanguageRepository: UserLanguageRepository,
    private readonly languageRepository: LanguageRepository,
    private readonly cacheService: CacheService,
    private readonly eventEmitter: EventEmitterService,
  ) {}

  private readonly CACHE_PREFIX = "user_language:"

  async getUserLanguage(userId: string): Promise<UserLanguagePreference> {
    const cacheKey = `${this.CACHE_PREFIX}${userId}`
    const cached = await this.cacheService.get<UserLanguagePreference>(cacheKey)

    if (cached) {
      return cached
    }

    const preference = await this.userLanguageRepository.findByUserId(userId)

    if (!preference) {
      const defaultLanguage = await this.languageRepository.findDefault()
      if (!defaultLanguage) {
        throw new NotFoundException("Default language not found")
      }

      // Create a new preference with the default language
      const newPreference = await this.userLanguageRepository.create({
        userId,
        languageId: defaultLanguage.id,
        autoDetected: true,
      })

      await this.cacheService.set(cacheKey, newPreference, 3600) // Cache for 1 hour
      return newPreference
    }

    await this.cacheService.set(cacheKey, preference, 3600) // Cache for 1 hour
    return preference
  }

  async createUserLanguage(createDto: CreateUserLanguageDto): Promise<UserLanguagePreference> {
    const language = await this.languageRepository.findById(createDto.languageId)
    if (!language) {
      throw new NotFoundException(`Language with ID ${createDto.languageId} not found`)
    }

    const existingPreference = await this.userLanguageRepository.findByUserId(createDto.userId)

    if (existingPreference) {
      throw new Error(`User language preference already exists for user ${createDto.userId}`)
    }

    const newPreference = await this.userLanguageRepository.create({
      userId: createDto.userId,
      languageId: createDto.languageId,
      autoDetected: createDto.autoDetected || false,
      additionalPreferences: createDto.additionalPreferences,
      metadata: createDto.metadata,
    })

    // Invalidate cache
    await this.cacheService.delete(`${this.CACHE_PREFIX}${createDto.userId}`)

    // Emit event
    this.eventEmitter.emit("user.language.created", newPreference)

    return newPreference
  }

  async updateUserLanguage(userId: string, updateDto: UpdateUserLanguageDto): Promise<UserLanguagePreference> {
    const preference = await this.userLanguageRepository.findByUserId(userId)

    if (!preference) {
      throw new NotFoundException(`User language preference not found for user ${userId}`)
    }

    if (updateDto.languageId) {
      const language = await this.languageRepository.findById(updateDto.languageId)
      if (!language) {
        throw new NotFoundException(`Language with ID ${updateDto.languageId} not found`)
      }
    }

    const updatedPreference = await this.userLanguageRepository.update(preference.id, {
      languageId: updateDto.languageId,
      autoDetected: updateDto.autoDetected,
      additionalPreferences: updateDto.additionalPreferences,
      metadata: updateDto.metadata,
    })

    // Invalidate cache
    await this.cacheService.delete(`${this.CACHE_PREFIX}${userId}`)

    // Emit event
    this.eventEmitter.emit("user.language.updated", updatedPreference)

    return updatedPreference
  }

  async deleteUserLanguage(userId: string): Promise<void> {
    const preference = await this.userLanguageRepository.findByUserId(userId)

    if (!preference) {
      throw new NotFoundException(`User language preference not found for user ${userId}`)
    }

    await this.userLanguageRepository.remove(preference.id)

    // Invalidate cache
    await this.cacheService.delete(`${this.CACHE_PREFIX}${userId}`)

    // Emit event
    this.eventEmitter.emit("user.language.deleted", { userId })
  }
}

