import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Video, VideoStatus } from "../entities/video.entity"
import type { CreateVideoDto } from "../dto/create-video.dto"
import type { UpdateVideoDto } from "../dto/update-video.dto"
import type { VideoQueryDto } from "../dto/video-query.dto"
import type { StorageFactoryService } from "../storage/storage-factory.service"

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    private storageFactoryService: StorageFactoryService,
  ) {}

  async create(createVideoDto: CreateVideoDto): Promise<Video> {
    const video = this.videoRepository.create(createVideoDto)
    return this.videoRepository.save(video)
  }

  async findAll(queryDto: VideoQueryDto): Promise<[Video[], number]> {
    const { userId, status, visibility, search } = queryDto

    const queryBuilder = this.videoRepository.createQueryBuilder("video")

    if (userId) {
      queryBuilder.andWhere("video.userId = :userId", { userId })
    }

    if (status) {
      queryBuilder.andWhere("video.status = :status", { status })
    }

    if (visibility) {
      queryBuilder.andWhere("video.visibility = :visibility", { visibility })
    }

    if (search) {
      queryBuilder.andWhere("(video.title ILIKE :search OR video.description ILIKE :search)", { search: `%${search}%` })
    }

    queryBuilder.orderBy("video.createdAt", "DESC")

    return queryBuilder.getManyAndCount()
  }

  async findOne(id: string): Promise<Video> {
    const video = await this.videoRepository.findOne({ where: { id } })

    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`)
    }

    return video
  }

  async update(id: string, updateVideoDto: UpdateVideoDto): Promise<Video> {
    const video = await this.findOne(id)

    const updatedVideo = this.videoRepository.merge(video, updateVideoDto)
    return this.videoRepository.save(updatedVideo)
  }

  async remove(id: string): Promise<void> {
    const video = await this.findOne(id)

    // Delete the file from storage if it exists
    if (video.fileUrl) {
      const storageProvider = this.storageFactoryService.getStorageProvider()

      // Extract the key from the URL
      const urlParts = video.fileUrl.split("/")
      const key = urlParts[urlParts.length - 1]

      await storageProvider.deleteFile(key)
    }

    await this.videoRepository.remove(video)
  }

  async incrementViews(id: string): Promise<Video> {
    const video = await this.findOne(id)

    video.views += 1
    return this.videoRepository.save(video)
  }

  async getSignedUrl(id: string, expiresIn = 3600): Promise<string> {
    const video = await this.findOne(id)

    if (video.status !== VideoStatus.READY) {
      throw new BadRequestException("Video is not ready for streaming")
    }

    const storageProvider = this.storageFactoryService.getStorageProvider()

    // Extract the key from the URL
    const urlParts = video.fileUrl.split("/")
    const key = urlParts[urlParts.length - 1]

    return storageProvider.getSignedUrl(key, expiresIn)
  }

  async updateVideoStatus(id: string, status: VideoStatus): Promise<Video> {
    const video = await this.findOne(id)

    video.status = status
    return this.videoRepository.save(video)
  }
}

