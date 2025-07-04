import { Test, type TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { ConfigService } from "@nestjs/config"
import type { Repository } from "typeorm"
import { MaintenanceModeService } from "./maintenance-mode.service"
import { MaintenanceConfig } from "./entities/maintenance-config.entity"
import { jest } from "@jest/globals"

describe("MaintenanceModeService", () => {
  let service: MaintenanceModeService
  let repository: Repository<MaintenanceConfig>
  let configService: ConfigService

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  }

  const mockConfigService = {
    get: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaintenanceModeService,
        {
          provide: getRepositoryToken(MaintenanceConfig),
          useValue: mockRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile()

    service = module.get<MaintenanceModeService>(MaintenanceModeService)
    repository = module.get<Repository<MaintenanceConfig>>(getRepositoryToken(MaintenanceConfig))
    configService = module.get<ConfigService>(ConfigService)
  })

  afterEach(() => {
    jest.clearAllMocks()
    service.clearCache()
  })

  describe("getMaintenanceStatus", () => {
    it("should return maintenance status", async () => {
      const mockConfig = {
        id: "1",
        isMaintenanceMode: true,
        maintenanceMessage: "Under maintenance",
        scheduledStart: null,
        scheduledEnd: null,
        enabledByUsername: "admin",
        reason: "System updates",
        updatedAt: new Date(),
      }

      mockRepository.findOne.mockResolvedValue(mockConfig)

      const result = await service.getMaintenanceStatus()

      expect(result.isMaintenanceMode).toBe(true)
      expect(result.maintenanceMessage).toBe("Under maintenance")
      expect(result.enabledByUsername).toBe("admin")
    })
  })

  describe("enableMaintenanceMode", () => {
    it("should enable maintenance mode", async () => {
      const mockConfig = {
        id: "1",
        isMaintenanceMode: false,
        maintenanceMessage: "System is running normally",
        allowedRoutes: ["/health"],
        blockApiRoutes: true,
        blockWebRoutes: true,
        updatedAt: new Date(),
      }

      const updatedConfig = {
        ...mockConfig,
        isMaintenanceMode: true,
        enabledBy: "admin-123",
        enabledByUsername: "admin",
        reason: "System updates",
      }

      mockRepository.findOne.mockResolvedValue(mockConfig)
      mockRepository.save.mockResolvedValue(updatedConfig)

      const result = await service.enableMaintenanceMode("admin-123", "admin", "System updates")

      expect(result.isMaintenanceMode).toBe(true)
      expect(result.enabledByUsername).toBe("admin")
      expect(result.reason).toBe("System updates")
    })
  })

  describe("disableMaintenanceMode", () => {
    it("should disable maintenance mode", async () => {
      const mockConfig = {
        id: "1",
        isMaintenanceMode: true,
        maintenanceMessage: "Under maintenance",
        allowedRoutes: ["/health"],
        blockApiRoutes: true,
        blockWebRoutes: true,
        updatedAt: new Date(),
      }

      const updatedConfig = {
        ...mockConfig,
        isMaintenanceMode: false,
        enabledBy: "admin-123",
        enabledByUsername: "admin",
      }

      mockRepository.findOne.mockResolvedValue(mockConfig)
      mockRepository.save.mockResolvedValue(updatedConfig)

      const result = await service.disableMaintenanceMode("admin-123", "admin")

      expect(result.isMaintenanceMode).toBe(false)
      expect(result.enabledByUsername).toBe("admin")
    })
  })

  describe("addAllowedRoute", () => {
    it("should add new allowed route", async () => {
      const mockConfig = {
        id: "1",
        isMaintenanceMode: true,
        allowedRoutes: ["/health"],
        blockApiRoutes: true,
        blockWebRoutes: true,
        updatedAt: new Date(),
      }

      const updatedConfig = {
        ...mockConfig,
        allowedRoutes: ["/health", "/status"],
      }

      mockRepository.findOne.mockResolvedValue(mockConfig)
      mockRepository.save.mockResolvedValue(updatedConfig)

      const result = await service.addAllowedRoute("/status")

      expect(result.allowedRoutes).toContain("/status")
      expect(result.allowedRoutes).toHaveLength(2)
    })

    it("should not add duplicate route", async () => {
      const mockConfig = {
        id: "1",
        isMaintenanceMode: true,
        allowedRoutes: ["/health"],
        blockApiRoutes: true,
        blockWebRoutes: true,
        updatedAt: new Date(),
      }

      mockRepository.findOne.mockResolvedValue(mockConfig)

      const result = await service.addAllowedRoute("/health")

      expect(result.allowedRoutes).toHaveLength(1)
      expect(mockRepository.save).not.toHaveBeenCalled()
    })
  })

  describe("addAllowedUser", () => {
    it("should add new allowed user", async () => {
      const mockConfig = {
        id: "1",
        isMaintenanceMode: true,
        allowedUserIds: ["user-1"],
        blockApiRoutes: true,
        blockWebRoutes: true,
        updatedAt: new Date(),
      }

      const updatedConfig = {
        ...mockConfig,
        allowedUserIds: ["user-1", "user-2"],
      }

      mockRepository.findOne.mockResolvedValue(mockConfig)
      mockRepository.save.mockResolvedValue(updatedConfig)

      const result = await service.addAllowedUser("user-2")

      expect(result.allowedUserIds).toContain("user-2")
      expect(result.allowedUserIds).toHaveLength(2)
    })
  })
})
