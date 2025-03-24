import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Image, type ProcessingStatus } from "../entities/image.entity"
import type { CreateImageDto } from "../dto/create-image.dto"
import type { UpdateImageDto } from "../dto/update-image.dto"
import type { ImageQueryDto } from "../dto/image-query.dto"

@Injectable()
export class ImageRepository {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async create(createImageDto: CreateImageDto): Promise<Image> {
    const image = this.imageRepository.create(createImageDto)
    return this.imageRepository.save(image)
  }

  async findAll(query: ImageQueryDto): Promise<[Image[], number]> {
    const { page = 1, limit = 10, format, status, isOptimized } = query
    const skip = (page - 1) * limit

    const queryBuilder = this.imageRepository.createQueryBuilder("image")

    if (format) {
      queryBuilder.andWhere("image.format = :format", { format })
    }

    if (status) {
      queryBuilder.andWhere("image.status = :status", { status })
    }

    if (isOptimized !== undefined) {
      queryBuilder.andWhere("image.isOptimized = :isOptimized", { isOptimized })
    }

    queryBuilder.orderBy("image.createdAt", "DESC").skip(skip).take(limit)

    return queryBuilder.getManyAndCount()
  }

  async findOne(id: string): Promise<Image> {
    return this.imageRepository.findOne({ where: { id } })
  }

  async findByFilename(filename: string): Promise<Image> {
    return this.imageRepository.findOne({ where: { filename } })
  }

  async update(id: string, updateImageDto: UpdateImageDto): Promise<Image> {
    await this.imageRepository.update(id, updateImageDto)
    return this.findOne(id)
  }

  async updateStatus(id: string, status: ProcessingStatus): Promise<void> {
    await this.imageRepository.update(id, { status })
  }

  async addVariant(id: string, variant: Record<string, any>): Promise<Image> {
    const image = await this.findOne(id)
    const variants = image.variants || []
    variants.push(variant)

    await this.imageRepository.update(id, { variants })
    return this.findOne(id)
  }

  async remove(id: string): Promise<void> {
    await this.imageRepository.delete(id)
  }

  async softDelete(id: string): Promise<void> {
    await this.imageRepository.update(id, { isActive: false })
  }
}

