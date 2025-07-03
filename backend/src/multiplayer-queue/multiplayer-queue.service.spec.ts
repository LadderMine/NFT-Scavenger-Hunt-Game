import { Test, type TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { MultiplayerQueueService } from "./multiplayer-queue.service"
import { Queue, QueueStatus, SkillLevel } from "./entities/queue.entity"
import { Match } from "./entities/match.entity"
import { BadRequestException, NotFoundException } from "@nestjs/common"
import { jest } from "@jest/globals"

describe("MultiplayerQueueService", () => {
  let service: MultiplayerQueueService
  let queueRepository: Repository<Queue>
  let matchRepository: Repository<Match>

  const mockQueueRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  }

  const mockMatchRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MultiplayerQueueService,
        {
          provide: getRepositoryToken(Queue),
          useValue: mockQueueRepository,
        },
        {
          provide: getRepositoryToken(Match),
          useValue: mockMatchRepository,
        },
      ],
    }).compile()

    service = module.get<MultiplayerQueueService>(MultiplayerQueueService)
    queueRepository = module.get<Repository<Queue>>(getRepositoryToken(Queue))
    matchRepository = module.get<Repository<Match>>(getRepositoryToken(Match))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("joinQueue", () => {
    it("should successfully join queue", async () => {
      const joinQueueDto = {
        userId: "123e4567-e89b-12d3-a456-426614174000",
        username: "testuser",
        skillLevel: SkillLevel.BEGINNER,
        gameMode: "classic",
      }

      const mockQueueEntry = {
        id: "queue-1",
        ...joinQueueDto,
        status: QueueStatus.WAITING,
        waitTime: 0,
        matchId: null,
        createdAt: new Date(),
        matchedAt: null,
        preferences: {},
      }

      mockQueueRepository.findOne.mockResolvedValue(null) // No existing entry
      mockQueueRepository.create.mockReturnValue(mockQueueEntry)
      mockQueueRepository.save.mockResolvedValue(mockQueueEntry)

      const result = await service.joinQueue(joinQueueDto)

      expect(result.userId).toBe(joinQueueDto.userId)
      expect(result.status).toBe(QueueStatus.WAITING)
      expect(mockQueueRepository.findOne).toHaveBeenCalledWith({
        where: { userId: joinQueueDto.userId, status: QueueStatus.WAITING },
      })
    })

    it("should throw BadRequestException if user already in queue", async () => {
      const joinQueueDto = {
        userId: "123e4567-e89b-12d3-a456-426614174000",
        username: "testuser",
        skillLevel: SkillLevel.BEGINNER,
        gameMode: "classic",
      }

      const existingEntry = { id: "existing", userId: joinQueueDto.userId }
      mockQueueRepository.findOne.mockResolvedValue(existingEntry)

      await expect(service.joinQueue(joinQueueDto)).rejects.toThrow(BadRequestException)
    })
  })

  describe("leaveQueue", () => {
    it("should successfully leave queue", async () => {
      const userId = "123e4567-e89b-12d3-a456-426614174000"
      const queueEntry = {
        id: "queue-1",
        userId,
        status: QueueStatus.WAITING,
        username: "testuser",
      }

      mockQueueRepository.findOne.mockResolvedValue(queueEntry)
      mockQueueRepository.save.mockResolvedValue({
        ...queueEntry,
        status: QueueStatus.LEFT,
        leftAt: expect.any(Date),
      })

      await service.leaveQueue(userId)

      expect(mockQueueRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: QueueStatus.LEFT,
          leftAt: expect.any(Date),
        }),
      )
    })

    it("should throw NotFoundException if user not in queue", async () => {
      const userId = "123e4567-e89b-12d3-a456-426614174000"
      mockQueueRepository.findOne.mockResolvedValue(null)

      await expect(service.leaveQueue(userId)).rejects.toThrow(NotFoundException)
    })
  })

  describe("getQueueStatus", () => {
    it("should return queue status for user", async () => {
      const userId = "123e4567-e89b-12d3-a456-426614174000"
      const queueEntry = {
        id: "queue-1",
        userId,
        username: "testuser",
        status: QueueStatus.WAITING,
        skillLevel: SkillLevel.BEGINNER,
        gameMode: "classic",
        waitTime: 0,
        matchId: null,
        createdAt: new Date(Date.now() - 30000), // 30 seconds ago
        matchedAt: null,
      }

      mockQueueRepository.findOne.mockResolvedValue(queueEntry)
      mockQueueRepository.save.mockResolvedValue({
        ...queueEntry,
        waitTime: 30,
      })

      const result = await service.getQueueStatus(userId)

      expect(result).toBeDefined()
      expect(result!.userId).toBe(userId)
      expect(result!.waitTime).toBeGreaterThan(0)
    })

    it("should return null if user not in queue", async () => {
      const userId = "123e4567-e89b-12d3-a456-426614174000"
      mockQueueRepository.findOne.mockResolvedValue(null)

      const result = await service.getQueueStatus(userId)

      expect(result).toBeNull()
    })
  })

  describe("getQueueStats", () => {
    it("should return queue statistics", async () => {
      const mockQueueEntries = [
        {
          skillLevel: SkillLevel.BEGINNER,
          gameMode: "classic",
          createdAt: new Date(Date.now() - 60000), // 1 minute ago
        },
        {
          skillLevel: SkillLevel.INTERMEDIATE,
          gameMode: "classic",
          createdAt: new Date(Date.now() - 30000), // 30 seconds ago
        },
      ]

      mockQueueRepository.find.mockResolvedValue(mockQueueEntries)
      mockMatchRepository.count.mockResolvedValue(5)

      const result = await service.getQueueStats()

      expect(result.totalInQueue).toBe(2)
      expect(result.bySkillLevel[SkillLevel.BEGINNER]).toBe(1)
      expect(result.bySkillLevel[SkillLevel.INTERMEDIATE]).toBe(1)
      expect(result.byGameMode.classic).toBe(2)
      expect(result.matchesToday).toBe(5)
    })
  })
})
