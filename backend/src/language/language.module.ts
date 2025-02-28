import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { HttpModule } from "@nestjs/axios"

// Controllers
import { UserLanguageController } from "./controllers/user-language.controller"
import { TranslationController } from "./controllers/translation.controller"
import { LanguageDetectionController } from "./controllers/language-detection.controller"
import { PuzzleTranslationController } from "./controllers/puzzle-translation.controller"
import { AdminTranslationController } from "./controllers/admin-translation.controller"

// Services
import { UserLanguageService } from "./services/user-language.service"
import { TranslationService } from "./services/translation.service"
import { LanguageDetectionService } from "./services/language-detection.service"
import { PuzzleTranslationService } from "./services/puzzle-translation.service"
import { AdminTranslationService } from "./services/admin-translation.service"
import { CacheService } from "./services/cache.service"
import { EventEmitterService } from "./services/event-emitter.service"

// Entities
import { UserLanguagePreference } from "./entities/user-language-preference.entity"
import { Translation } from "./entities/translation.entity"
import { Language } from "./entities/language.entity"
import { Puzzle } from "./entities/puzzle.entity"
import { PuzzleTranslation } from "./entities/puzzle-translation.entity"
import { TranslationKey } from "./entities/translation-key.entity"

// Repositories
import { UserLanguageRepository } from "./repositories/user-language.repository"
import { TranslationRepository } from "./repositories/translation.repository"
import { LanguageRepository } from "./repositories/language.repository"
import { PuzzleRepository } from "./repositories/puzzle.repository"
import { PuzzleTranslationRepository } from "./repositories/puzzle-translation.repository"
import { TranslationKeyRepository } from "./repositories/translation-key.repository"

// Guards
import { LanguageGuard } from "./guards/language.guard"

// Interceptors
import { LanguageInterceptor } from "./interceptors/language.interceptor"

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserLanguagePreference,
      Translation,
      Language,
      Puzzle,
      PuzzleTranslation,
      TranslationKey,
    ]),
    HttpModule,
  ],
  controllers: [
    UserLanguageController,
    TranslationController,
    LanguageDetectionController,
    PuzzleTranslationController,
    AdminTranslationController,
  ],
  providers: [
    UserLanguageService,
    TranslationService,
    LanguageDetectionService,
    PuzzleTranslationService,
    AdminTranslationService,
    CacheService,
    EventEmitterService,
    UserLanguageRepository,
    TranslationRepository,
    LanguageRepository,
    PuzzleRepository,
    PuzzleTranslationRepository,
    TranslationKeyRepository,
    LanguageGuard,
    LanguageInterceptor,
  ],
  exports: [UserLanguageService, TranslationService, LanguageDetectionService, PuzzleTranslationService],
})
export class LanguageModule {}

