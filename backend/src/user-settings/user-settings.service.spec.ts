import { Test, type TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { UserSettingsService } from "./user-settings.service"
import { UserSettings, Language, Theme, SoundVolume } from "./entities/user-settings.entity"
import { BadRequestException } from "@nestjs/common"
import { jest } from "@jest/globals"

describe("UserSettingsService", () => {
  let service: UserSettingsService
  let repository: Repository<UserSettings>

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSettingsService,
        {
          provide: getRepositoryToken(UserSettings),
          useValue: mockRepository,
        },
      ],
    }).compile()

    service = module.get<UserSettingsService>(UserSettingsService)
    repository = module.get<Repository<UserSettings>>(getRepositoryToken(UserSettings))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("getUserSettings", () => {
    it("should return existing user settings", async () => {
      const userId = "123e4567-e89b-12d3-a456-426614174000"
      const mockSettings = {
        id: "settings-1",
        userId,
        language: Language.ENGLISH,
        theme: Theme.DARK,
        darkMode: true,
        notificationsEnabled: true,
        masterVolume: SoundVolume.MEDIUM,
        difficulty: "normal",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockRepository.findOne.mockResolvedValue(mockSettings)

      const result = await service.getUserSettings(userId)

      expect(result.userId).toBe(userId)
      expect(result.language).toBe(Language.ENGLISH)
      expect(result.theme).toBe(Theme.DARK)
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { userId } })
    })

    it("should create default settings if none exist", async () => {
      const userId = "123e4567-e89b-12d3-a456-426614174000"
      const mockDefaultSettings = {
        id: "settings-1",
        userId,
        language: Language.ENGLISH,
        theme: Theme.AUTO,
        darkMode: false,
        notificationsEnabled: true,
        masterVolume: SoundVolume.MEDIUM,
        difficulty: "normal",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockRepository.findOne.mockResolvedValue(null)
      mockRepository.create.mockReturnValue(mockDefaultSettings)
      mockRepository.save.mockResolvedValue(mockDefaultSettings)

      const result = await service.getUserSettings(userId)

      expect(result.userId).toBe(userId)
      expect(result.language).toBe(Language.ENGLISH)
      expect(result.theme).toBe(Theme.AUTO)
      expect(mockRepository.create).toHaveBeenCalled()
      expect(mockRepository.save).toHaveBeenCalled()
    })
  })

  describe("updateUserSettings", () => {
    it("should update existing user settings", async () => {
      const userId = "123e4567-e89b-12d3-a456-426614174000"
      const updateDto = {
        language: Language.SPANISH,
        theme: Theme.DARK,
        notificationsEnabled: false,
      }

      const existingSettings = {
        id: "settings-1",
        userId,
        language: Language.ENGLISH,
        theme: Theme.LIGHT,
        darkMode: false,
        notificationsEnabled: true,
        masterVolume: SoundVolume.MEDIUM,
        difficulty: "normal",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const updatedSettings = {
        ...existingSettings,
        ...updateDto,
        darkMode: true, // Should be set by applySettingsLogic
        emailNotifications: false, // Should be set by applySettingsLogic
        pushNotifications: false, // Should be set by applySettingsLogic
        smsNotifications: false, // Should be set by applySettingsLogic
      }

      mockRepository.findOne.mockResolvedValue(existingSettings)
      mockRepository.save.mockResolvedValue(updatedSettings)

      const result = await service.updateUserSettings(userId, updateDto)

      expect(result.language).toBe(Language.SPANISH)
      expect(result.theme).toBe(Theme.DARK)
      expect(result.darkMode).toBe(true)
      expect(result.notificationsEnabled).toBe(false)
    })

    it("should create default settings if none exist during update", async () => {
      const userId = "123e4567-e89b-12d3-a456-426614174000"
      const updateDto = {
        language: Language.FRENCH,
      }

      const defaultSettings = {
        id: "settings-1",
        userId,
        language: Language.ENGLISH,
        theme: Theme.AUTO,
        darkMode: false,
        notificationsEnabled: true,
        masterVolume: SoundVolume.MEDIUM,
        difficulty: "normal",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const updatedSettings = {
        ...defaultSettings,
        language: Language.FRENCH,
      }

      mockRepository.findOne.mockResolvedValueOnce(null) // First call returns null
      mockRepository.create.mockReturnValue(defaultSettings)
      mockRepository.save.mockResolvedValueOnce(defaultSettings) // Create default
      mockRepository.save.mockResolvedValueOnce(updatedSettings) // Update with new values

      const result = await service.updateUserSettings(userId, updateDto)

      expect(result.language).toBe(Language.FRENCH)
      expect(mockRepository.create).toHaveBeenCalled()
      expect(mockRepository.save).toHaveBeenCalledTimes(2)
    })
  })

  describe("validateSettings", () => {
    it("should throw BadRequestException for invalid autoSaveInterval", async () => {
      const userId = "123e4567-e89b-12d3-a456-426614174000"
      const updateDto = {
        autoSaveInterval: 5, // Invalid: less than 10
      }

      await expect(service.updateUserSettings(userId, updateDto)).rejects.toThrow(BadRequestException)
    })

    it("should throw BadRequestException for invalid textSize", async () => {
      const userId = "123e4567-e89b-12d3-a456-426614174000"
      const updateDto = {
        textSize: 250, // Invalid: greater than 200
      }

      await expect(service.updateUserSettings(userId, updateDto)).rejects.toThrow(BadRequestException)
    })

    it("should throw BadRequestException for invalid notification types", async () => {
      const userId = "123e4567-e89b-12d3-a456-426614174000"
      const updateDto = {
        notificationTypes: {
          invalidKey: true, // Invalid notification type
        },
      }

      await expect(service.updateUserSettings(userId, updateDto)).rejects.toThrow(BadRequestException)
    })
  })

  describe("resetUserSettings", () => {
    it("should reset user settings to defaults", async () => {
      const userId = "123e4567-e89b-12d3-a456-426614174000"
      const existingSettings = {
        id: "settings-1",
        userId,
        language: Language.SPANISH,
        theme: Theme.DARK,
        darkMode: true,
        notificationsEnabled: false,
        masterVolume: SoundVolume.HIGH,
        difficulty: "expert",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const resetSettings = {
        ...existingSettings,
        language: Language.ENGLISH,
        theme: Theme.AUTO,
        darkMode: false,
        notificationsEnabled: true,
        masterVolume: SoundVolume.MEDIUM,
        difficulty: "normal",
      }

      mockRepository.findOne.mockResolvedValue(existingSettings)
      mockRepository.save.mockResolvedValue(resetSettings)

      const result = await service.resetUserSettings(userId)

      expect(result.language).toBe(Language.ENGLISH)
      expect(result.\
