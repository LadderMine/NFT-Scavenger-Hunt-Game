import { Test, type TestingModule } from "@nestjs/testing"
import { ActivityLogsController } from "../activity-logs.controller"
import { ActivityLogsService } from "../activity-logs.service"
import type { CreateActivityLogDto } from "../dto/create-activity-log.dto"
import type { QueryActivityLogsDto } from "../dto/query-activity-logs.dto"

describe("ActivityLogsController", () => {
  let controller: ActivityLogsController
  let service: ActivityLogsService

  const mockActivityLogsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    deleteOldLogs: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityLogsController],
      providers: [
        {
          provide: ActivityLogsService,
          useValue: mockActivityLogsService,
        },
      ],
    }).compile()

    controller = module.get<ActivityLogsController>(ActivityLogsController)
    service = module.get<ActivityLogsService>(ActivityLogsService)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  describe("create", () => {
    it("should create a new activity log", async () => {
      const dto: CreateActivityLogDto = {
        action: "LOGIN",
        metadata: { browser: "Chrome" },
      }

      const request = {
        ip: "127.0.0.1",
        headers: {
          "user-agent": "Mozilla/5.0",
        },
      }

      const expectedLog = {
        id: "1",
        ...dto,
        ipAddress: "127.0.0.1",
        userAgent: "Mozilla/5.0",
        createdAt: new Date(),
      }

      mockActivityLogsService.create.mockResolvedValue(expectedLog)

      const result = await controller.create(dto, request as any)

      expect(service.create).toHaveBeenCalledWith({
        ...dto,
        ipAddress: "127.0.0.1",
        userAgent: "Mozilla/5.0",
      })
      expect(result).toEqual(expectedLog)
    })
  })

  describe("findAll", () => {
    it("should return paginated activity logs", async () => {
      const query: QueryActivityLogsDto = {
        page: 1,
        limit: 10,
      }

      const expectedResult = {
        data: [{ id: "1", action: "LOGIN" }],
        total: 1,
        page: 1,
        limit: 10,
      }

      mockActivityLogsService.findAll.mockResolvedValue(expectedResult)

      const result = await controller.findAll(query)

      expect(service.findAll).toHaveBeenCalledWith(query)
      expect(result).toEqual(expectedResult)
    })
  })

  describe("deleteOldLogs", () => {
    it("should delete logs older than the specified date", async () => {
      const dateString = "2023-01-01"
      const expectedResult = { deleted: 5 }

      mockActivityLogsService.deleteOldLogs.mockResolvedValue(expectedResult)

      const result = await controller.deleteOldLogs(dateString)

      expect(service.deleteOldLogs).toHaveBeenCalledWith(new Date(dateString))
      expect(result).toEqual(expectedResult)
    })

    it("should use default date if none provided", async () => {
      const expectedResult = { deleted: 5 }

      mockActivityLogsService.deleteOldLogs.mockResolvedValue(expectedResult)

      const result = await controller.deleteOldLogs(undefined)

      expect(service.deleteOldLogs).toHaveBeenCalled()
      expect(result).toEqual(expectedResult)
    })
  })
})

