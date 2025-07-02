import { Test, type TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { UserReactionService } from "./user-reaction.service"
import { Reaction } from "./entities/reaction.entity"
import { BadRequestException, NotFoundException } from "@nestjs/common"
import { jest } from "@jest/globals" // Import jest to declare it

describe("UserReactionService", () => {
  let service: UserReactionService
  let repository: Repository<Reaction>

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserReactionService,
        {
          provide: getRepositoryToken(Reaction),
          useValue: mockRepository,
        },
      ],
    }).compile()

    service = module.get<UserReactionService>(UserReactionService)
    repository = module.get<Repository<Reaction>>(getRepositoryToken(Reaction))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("createReaction", () => {
    it("should create a new reaction", async () => {
      const createReactionDto = {
        userId: "123e4567-e89b-12d3-a456-426614174000",
        contentId: "puzzle-1",
        emoji: "👍",
      }

      const mockReaction = { id: "1", ...createReactionDto, createdAt: new Date(), updatedAt: new Date() }

      mockRepository.findOne.mockResolvedValue(null)
      mockRepository.create.mockReturnValue(mockReaction)
      mockRepository.save.mockResolvedValue(mockReaction)

      const result = await service.createReaction(createReactionDto)

      expect(result).toEqual(mockReaction)
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { userId: createReactionDto.userId, contentId: createReactionDto.contentId },
      })
      expect(mockRepository.create).toHaveBeenCalledWith(createReactionDto)
      expect(mockRepository.save).toHaveBeenCalledWith(mockReaction)
    })

    it("should update existing reaction", async () => {
      const createReactionDto = {
        userId: "123e4567-e89b-12d3-a456-426614174000",
        contentId: "puzzle-1",
        emoji: "❤️",
      }

      const existingReaction = {
        id: "1",
        userId: createReactionDto.userId,
        contentId: createReactionDto.contentId,
        emoji: "👍",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const updatedReaction = { ...existingReaction, emoji: "❤️" }

      mockRepository.findOne.mockResolvedValue(existingReaction)
      mockRepository.save.mockResolvedValue(updatedReaction)

      const result = await service.createReaction(createReactionDto)

      expect(result).toEqual(updatedReaction)
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          emoji: "❤️",
        }),
      )
    })

    it("should throw BadRequestException for invalid emoji", async () => {
      const createReactionDto = {
        userId: "123e4567-e89b-12d3-a456-426614174000",
        contentId: "puzzle-1",
        emoji: "🚀", // Invalid emoji
      }

      await expect(service.createReaction(createReactionDto)).rejects.toThrow(BadRequestException)
    })
  })

  describe("getReactionAggregation", () => {
    it("should return aggregated reaction counts", async () => {
      const contentId = "puzzle-1"
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { emoji: "👍", count: "3" },
          { emoji: "❤️", count: "2" },
          { emoji: "🤔", count: "1" },
        ]),
      }

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder)

      const result = await service.getReactionAggregation(contentId)

      expect(result).toEqual({
        contentId,
        reactions: {
          "👍": 3,
          "❤️": 2,
          "🤔": 1,
        },
        totalReactions: 6,
      })
    })
  })

  describe("removeReaction", () => {
    it("should remove reaction successfully", async () => {
      const reactionId = "1"
      mockRepository.delete.mockResolvedValue({ affected: 1 })

      await service.removeReaction(reactionId)

      expect(mockRepository.delete).toHaveBeenCalledWith(reactionId)
    })

    it("should throw NotFoundException when reaction not found", async () => {
      const reactionId = "1"
      mockRepository.delete.mockResolvedValue({ affected: 0 })

      await expect(service.removeReaction(reactionId)).rejects.toThrow(NotFoundException)
    })
  })

  describe("getAllowedEmojis", () => {
    it("should return list of allowed emojis", () => {
      const result = service.getAllowedEmojis()

      expect(result).toEqual(["👍", "👎", "❤️", "😂", "😮", "😢", "😡", "🤔", "🎉", "🔥"])
    })
  })
})
