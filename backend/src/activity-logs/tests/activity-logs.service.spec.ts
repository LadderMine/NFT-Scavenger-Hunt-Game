import { Test, type TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { ActivityLogsService } from "../activity-logs.service"
import { ActivityLog } from "../entities/activity-log.entity"

describe("ActivityLogsService", () => {
  let service: ActivityLogsService
  let repository: Repository<ActivityLog>

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      delete: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      execute: jest.fn(),
    })),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityLogsService,
        {
          provide: getRepositoryToken(ActivityLog),
          useValue: mockRepository,
        },
      ],
    }).compile()

    service = module.get<ActivityLogsService>(ActivityLogsService)
    repository = module.get<Repository<ActivityLog>>(getRepositoryToken(ActivityLog))
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("create", () => {
    it("should create and save a new activity log", async () => {
      const createDto = {
        userId: "123",
        action: "LOGIN",
        metadata: { browser: "Chrome" },
      }

      const activityLog = { id: "1", ...createDto, createdAt: new Date() }

      mockRepository.create.mockReturnValue(activityLog)
      mockRepository.save.mockResolvedValue(activityLog)

      const result = await service.create(createDto)

      expect(mockRepository.create).toHaveBeenCalledWith(createDto)
      expect(mockRepository.save).toHaveBeenCalledWith(activityLog)
      expect(result).toEqual(activityLog)
    })
  })

  describe("findAll", () => {
    it("should return paginated activity logs with filters", async () => {
      const queryParams = {
        userId: "123",
        action: "LOGIN",
        page: 1,
        limit: 10,
      }

      const logs = [{ id: "1", action: "LOGIN" }]
      mockRepository.findAndCount.mockResolvedValue([logs, 1])

      const result = await service.findAll(queryParams)

      expect(mockRepository.findAndCount).toHaveBeenCalled()
      expect(result).toEqual({
        data: logs,
        total: 1,
        page: 1,
        limit: 10,
      })
    })
  })

  describe("deleteOldLogs", () => {
    it("should delete logs older than the specified date", async () => {
      const date = new Date()
      const mockQueryBuilder = repository.createQueryBuilder()
      mockQueryBuilder.execute.mockResolvedValue({ affected: 5 })

      const result = await service.deleteOldLogs(date)

      expect(mockQueryBuilder.delete).toHaveBeenCalled()
      expect(mockQueryBuilder.where).toHaveBeenCalledWith("createdAt < :olderThan", { olderThan: date })
      expect(result).toEqual({ deleted: 5 })
    })
  })
})

