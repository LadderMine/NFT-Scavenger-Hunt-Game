import { Test, type TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { VideoService } from "../services/video.service"
import { Video, VideoStatus, VideoVisibility } from "../entities/video.entity"
import { StorageFactoryService } from "../storage/storage-factory.service"
import { NotFoundException, BadRequestException } from "@nestjs/common"
import type { CreateVideoDto } from "../dto/create-video.dto"
import type { UpdateVideoDto } from "../dto/update-video.dto"

const mockVideo = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  title: "Test Video",
  description: "Test Description",
  fileUrl: "https://example.com/videos/test.mp4",
  thumbnailUrl: "https://example.com/thumbnails/test.jpg",
  duration: 120,
  status: VideoStatus.READY,
  visibility: VideoVisibility.PUBLIC,
  views: 0,
  userId: "123e4567-e89b-12d3-a456-426614174001",
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockStorageProvider = {
  getSignedUrl: jest.fn().mockResolvedValue("https://signed-url.com"),
  deleteFile: jest.fn().mockResolvedValue(true),
}

describe("VideoService", () => {
  let service: VideoService
  let repository: Repository<Video>
  let storageFactoryService: StorageFactoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoService,
        {
          provide: getRepositoryToken(Video),
          useClass: Repository,
        },
        {
          provide: StorageFactoryService,
          useValue: {
            getStorageProvider: jest.fn().mockReturnValue(mockStorageProvider),
          },
        },
      ],
    }).compile()

    service = module.get<VideoService>(VideoService)
    repository = module.get<Repository<Video>>(getRepositoryToken(Video))
    storageFactoryService = module.get<StorageFactoryService>(StorageFactoryService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("create", () => {
    it("should create a new video", async () => {
      const createVideoDto: CreateVideoDto = {
        title: "Test Video",
        description: "Test Description",
        visibility: VideoVisibility.PUBLIC,
        userId: "123e4567-e89b-12d3-a456-426614174001",
      }

      jest.spyOn(repository, "create").mockReturnValue(mockVideo as any)
      jest.spyOn(repository, "save").mockResolvedValue(mockVideo as any)

      const result = await service.create(createVideoDto)
      expect(result).toEqual(mockVideo)
      expect(repository.create).toHaveBeenCalledWith(createVideoDto)
      expect(repository.save).toHaveBeenCalledWith(mockVideo)
    })
  })

  describe("findAll", () => {
    it("should return an array of videos", async () => {
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockVideo], 1]),
      }

      jest.spyOn(repository, "createQueryBuilder").mockReturnValue(queryBuilder as any)

      const result = await service.findAll({})
      expect(result).toEqual([[mockVideo], 1])
      expect(repository.createQueryBuilder).toHaveBeenCalledWith("video")
      expect(queryBuilder.orderBy).toHaveBeenCalledWith("video.createdAt", "DESC")
      expect(queryBuilder.getManyAndCount).toHaveBeenCalled()
    })

    it("should filter videos by userId", async () => {
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockVideo], 1]),
      }

      jest.spyOn(repository, "createQueryBuilder").mockReturnValue(queryBuilder as any)

      await service.findAll({ userId: "123e4567-e89b-12d3-a456-426614174001" })
      expect(queryBuilder.andWhere).toHaveBeenCalledWith("video.userId = :userId", {
        userId: "123e4567-e89b-12d3-a456-426614174001",
      })
    })
  })

  describe("findOne", () => {
    it("should return a video by id", async () => {
      jest.spyOn(repository, "findOne").mockResolvedValue(mockVideo as any)

      const result = await service.findOne("123e4567-e89b-12d3-a456-426614174000")
      expect(result).toEqual(mockVideo)
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: "123e4567-e89b-12d3-a456-426614174000" },
      })
    })

    it("should throw NotFoundException if video not found", async () => {
      jest.spyOn(repository, "findOne").mockResolvedValue(null)

      await expect(service.findOne("not-found")).rejects.toThrow(NotFoundException)
    })
  })

  describe("update", () => {
    it("should update a video", async () => {
      const updateVideoDto: UpdateVideoDto = {
        title: "Updated Title",
      }

      jest.spyOn(service, "findOne").mockResolvedValue(mockVideo as any)
      jest.spyOn(repository, "merge").mockReturnValue({
        ...mockVideo,
        title: "Updated Title",
      } as any)
      jest.spyOn(repository, "save").mockResolvedValue({
        ...mockVideo,
        title: "Updated Title",
      } as any)

      const result = await service.update("123e4567-e89b-12d3-a456-426614174000", updateVideoDto)
      expect(result).toEqual({
        ...mockVideo,
        title: "Updated Title",
      })
      expect(service.findOne).toHaveBeenCalledWith("123e4567-e89b-12d3-a456-426614174000")
      expect(repository.merge).toHaveBeenCalledWith(mockVideo, updateVideoDto)
      expect(repository.save).toHaveBeenCalled()
    })
  })

  describe("remove", () => {
    it("should remove a video and delete the file", async () => {
      jest.spyOn(service, "findOne").mockResolvedValue(mockVideo as any)
      jest.spyOn(repository, "remove").mockResolvedValue(undefined)

      await service.remove("123e4567-e89b-12d3-a456-426614174000")
      expect(service.findOne).toHaveBeenCalledWith("123e4567-e89b-12d3-a456-426614174000")
      expect(mockStorageProvider.deleteFile).toHaveBeenCalled()
      expect(repository.remove).toHaveBeenCalledWith(mockVideo)
    })
  })

  describe("getSignedUrl", () => {
    it("should return a signed URL for a video", async () => {
      jest.spyOn(service, "findOne").mockResolvedValue(mockVideo as any)

      const result = await service.getSignedUrl("123e4567-e89b-12d3-a456-426614174000")
      expect(result).toEqual("https://signed-url.com")
      expect(service.findOne).toHaveBeenCalledWith("123e4567-e89b-12d3-a456-426614174000")
      expect(mockStorageProvider.getSignedUrl).toHaveBeenCalled()
    })

    it("should throw BadRequestException if video is not ready", async () => {
      jest.spyOn(service, "findOne").mockResolvedValue({
        ...mockVideo,
        status: VideoStatus.PROCESSING,
      } as any)

      await expect(service.getSignedUrl("123e4567-e89b-12d3-a456-426614174000")).rejects.toThrow(BadRequestException)
    })
  })
})

