import { Injectable } from "@nestjs/common"
import type { HttpService } from "@nestjs/axios"
import type { LanguageRepository } from "../repositories/language.repository"
import type { UserLanguageRepository } from "../repositories/user-language.repository"
import type { Language } from "../entities/language.entity"
import { firstValueFrom } from "rxjs"
import type { CacheService } from "./cache.service"

@Injectable()
export class LanguageDetectionService {
  constructor(
    private readonly languageRepository: LanguageRepository,
    private readonly userLanguageRepository: UserLanguageRepository,
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
  ) {}

  private readonly CACHE_PREFIX = "language_detection:"
  private readonly IP_GEOLOCATION_API = "https://ipapi.co"

  async detectLanguageFromHeaders(acceptLanguageHeader: string): Promise<Language> {
    if (!acceptLanguageHeader) {
      return this.languageRepository.findDefault()
    }

    // Parse Accept-Language header
    const languages = acceptLanguageHeader
      .split(",")
      .map((lang) => {
        const [code, quality = "q=1.0"] = lang.trim().split(";")
        const q = Number.parseFloat(quality.split("=")[1]) || 1.0
        return { code: code.split("-")[0], quality: q }
      })
      .sort((a, b) => b.quality - a.quality)

    // Try to find a matching language
    for (const lang of languages) {
      const language = await this.languageRepository.findByCode(lang.code)
      if (language && language.isActive) {
        return language
      }
    }

    // Fallback to default language
    return this.languageRepository.findDefault()
  }

  async detectLanguageFromIP(ipAddress: string): Promise<Language> {
    const cacheKey = `${this.CACHE_PREFIX}ip:${ipAddress}`
    const cached = await this.cacheService.get<string>(cacheKey)

    if (cached) {
      const language = await this.languageRepository.findByCode(cached)
      if (language) {
        return language
      }
    }

    try {
      const response = await firstValueFrom(this.httpService.get(`${this.IP_GEOLOCATION_API}/${ipAddress}/json/`))

      const countryCode = response.data.country_code?.toLowerCase()
      const languageCode = response.data.languages?.split(",")[0]?.split("-")[0]

      // Try to find language by country-specific code first
      if (countryCode) {
        const countryLanguage = await this.languageRepository.findByCode(`${languageCode}-${countryCode}`)
        if (countryLanguage && countryLanguage.isActive) {
          await this.cacheService.set(cacheKey, countryLanguage.code, 86400) // Cache for 24 hours
          return countryLanguage
        }
      }

      // Try to find language by general code
      if (languageCode) {
        const language = await this.languageRepository.findByCode(languageCode)
        if (language && language.isActive) {
          await this.cacheService.set(cacheKey, language.code, 86400) // Cache for 24 hours
          return language
        }
      }

      // Fallback to default language
      const defaultLanguage = await this.languageRepository.findDefault()
      await this.cacheService.set(cacheKey, defaultLanguage.code, 86400) // Cache for 24 hours
      return defaultLanguage
    } catch (error) {
      // If API call fails, return default language
      return this.languageRepository.findDefault()
    }
  }

  async detectAndSaveUserLanguage(
    userId: string,
    acceptLanguageHeader?: string,
    ipAddress?: string,
  ): Promise<Language> {
    // Check if user already has a language preference
    const existingPreference = await this.userLanguageRepository.findByUserId(userId)
    if (existingPreference && !existingPreference.autoDetected) {
      // If user has manually set a preference, return that language
      return existingPreference.language
    }

    // Detect language
    let detectedLanguage: Language

    if (acceptLanguageHeader) {
      detectedLanguage = await this.detectLanguageFromHeaders(acceptLanguageHeader)
    } else if (ipAddress) {
      detectedLanguage = await this.detectLanguageFromIP(ipAddress)
    } else {
      detectedLanguage = await this.languageRepository.findDefault()
    }

    // Save or update user preference
    if (existingPreference) {
      await this.userLanguageRepository.update(existingPreference.id, {
        languageId: detectedLanguage.id,
        autoDetected: true,
      })
    } else {
      await this.userLanguageRepository.create({
        userId,
        languageId: detectedLanguage.id,
        autoDetected: true,
      })
    }

    return detectedLanguage
  }
}

