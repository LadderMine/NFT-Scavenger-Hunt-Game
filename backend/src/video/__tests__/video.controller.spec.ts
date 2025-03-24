import { Test, type TestingModule } from "@nestjs/testing"
import { VideoController } from "../controllers/video.controller"
import { VideoService } from "../services/video.service"
import { VideoUploadService } from "../services/video-upload.service"
import { VideoStreamingService } from "../services/video-streaming.service"
import { type Video, VideoStatus, VideoVisibility } from "../entities/video.entity"
import type { CreateVideoDto } from "../dto/create-video.dto"
import type { UpdateVideoDto } from "../dto/update-video.dto"
import { HttpStatus } from "@nestjs/common"
import type { Express } from "express"

const mockVideo: Partial<Video> = {
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

describe("VideoController", () => {
  let controller: VideoController
  let videoService: VideoService
  let videoUploadService: VideoUploadService
  let videoStreamingService: VideoStreamingService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [
        {
          provide: VideoService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockVideo),
            findAll: jest.fn().mockResolvedValue([[mockVideo], 1]),
            findOne: jest.fn().mockResolvedValue(mockVideo),
            update: jest.fn().mockResolvedValue(mockVideo),
            remove: jest.fn().mockResolvedValue(undefined),
            getSignedUrl: jest.fn().mockResolvedValue("https://signed-url.com"),
          },
        },
        {
          provide: VideoUploadService,
          useValue: {
            uploadVideo: jest.fn().mockResolvedValue(mockVideo),
          },
        },
        {
          provide: VideoStreamingService,
          useValue: {
            streamVideo: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile()

    controller = module.get<VideoController>(VideoController)
    videoService = module.get<VideoService>(VideoService)
    videoUploadService = module.get<VideoUploadService>(VideoUploadService)
    videoStreamingService = module.get<VideoStreamingService>(VideoStreamingService)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  describe("uploadVideo", () => {
    it("should upload a video", async () => {
      const file = {} as Express.Multer.File
      const createVideoDto: CreateVideoDto = {
        title: "Test Video",
        description: "Test Description",
      }
      const req = { user: { id: "123e4567-e89b-12d3-a456-426614174001" } }

      const result = await controller.uploadVideo(file, createVideoDto, req as any)

      expect(result).toEqual(mockVideo)
      expect(videoUploadService.uploadVideo).toHaveBeenCalledWith(file, {
        ...createVideoDto,
        userId: "123e4567-e89b-12d3-a456-426614174001",
      })
    })
  })

  describe("findAll", () => {
    it("should return all videos", async () => {
      const result = await controller.findAll({})

      expect(result).toEqual({
        data: [mockVideo],
        total: 1,
      })
      expect(videoService.findAll).toHaveBeenCalledWith({})
    })
  })

  describe("findOne", () => {
    it("should return a video by id", async () => {
      const result = await controller.findOne("123e4567-e89b-12d3-a456-426614174000")

      expect(result).toEqual(mockVideo)
      expect(videoService.findOne).toHaveBeenCalledWith("123e4567-e89b-12d3-a456-426614174000")
    })
  })

  describe("update", () => {
    it("should update a video", async () => {
      const updateVideoDto: UpdateVideoDto = {
        title: "Updated Title",
      }
      const req = { user: { id: "123e4567-e89b-12d3-a456-426614174001" } }

      const result = await controller.update("123e4567-e89b-12d3-a456-426614174000", updateVideoDto, req as any)

      expect(result).toEqual(mockVideo)
      expect(videoService.findOne).toHaveBeenCalledWith("123e4567-e89b-12d3-a456-426614174000")
      expect(videoService.update).toHaveBeenCalledWith("123e4567-e89b-12d3-a456-426614174000", updateVideoDto)
    })

    it("should return forbidden if user does not own the video", async () => {
      const updateVideoDto: UpdateVideoDto = {
        title: "Updated Title",
      }
      const req = { user: { id: "different-user-id" } }

      const result = await controller.update("123e4567-e89b-12d3-a456-426614174000", updateVideoDto, req as any)

      expect(result).toEqual({
        statusCode: HttpStatus.FORBIDDEN,
        message: "You do not have permission to update this video",
      })
      expect(videoService.findOne).toHaveBeenCalledWith("123e4567-e89b-12d3-a456-426614174000")
      expect(videoService.update).not.toHaveBeenCalled()
    })
  })

  describe("remove", () => {
    it("should remove a video", async () => {
      const req = { user: { id: "123e4567-e89b-12d3-a456-426614174001" } }

      const result = await controller.remove("123e4567-e89b-12d3-a456-426614174000", req as any)

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: "Video deleted successfully",
      })
      expect(videoService.findOne).toHaveBeenCalledWith("123e4567-e89b-12d3-a456-426614174000")
      expect(videoService.remove).toHaveBeenCalledWith("123e4567-e89b-12d3-a456-426614174000")
    })

    it("should return forbidden if user does not own the video", async () => {
      const req = { user: { id: "different-user-id" } }

      const result = await controller.remove("123e4567-e89b-12d3-a456-426614174000", req as any)

      expect(result).toEqual({
        statusCode: HttpStatus.FORBIDDEN,
        message: "You do not have permission to delete this video",
      })
      expect(videoService.findOne).toHaveBeenCalledWith("123e4567-e89b-12d3-a456-426614174000")
      expect(videoService.remove).not.toHaveBeenCalled()
    })
  })

  describe("getSignedUrl", () => {
    it("should return a signed URL for a video", async () => {
      const result = await controller.getSignedUrl("123e4567-e89b-12d3-a456-426614174000")

      expect(result).toEqual({ url: "https://signed-url.com" })
      expect(videoService.getSignedUrl).toHaveBeenCalledWith("123e4567-e89b-12d3-a456-426614174000", 3600)
    })
  })
})

