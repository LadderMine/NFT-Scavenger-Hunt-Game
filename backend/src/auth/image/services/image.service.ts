import { Injectable, Logger, BadRequestException, NotFoundException } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import * as path from "path"
import * as fs from "fs/promises"
import type { ImageRepository } from "../repositories/image.repository"
import type { StorageService } from "./storage.service"
import type { ProcessorService } from "./processor.service"
import { type Image, ImageFormat, ProcessingStatus } from "../entities/image.entity"
import type { CreateImageDto } from "../dto/create-image.dto"
import type { UpdateImageDto } from "../dto/update-image.dto"
import type { ProcessImageDto, BatchProcessImageDto } from "../dto/process-image.dto"
import type { ImageQueryDto } from "../dto/image-query.dto"
import type { ImageConfig } from "../config/image.config"
import type { Express } from "express"

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name)
  private readonly config: ImageConfig

  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly storageService: StorageService,
    private readonly processorService: ProcessorService,
    private readonly configService: ConfigService,
  ) {
    this.config = this.configService.get<ImageConfig>("image")
  }

  async uploadImage(file: Express.Multer.File): Promise<Image> {
    try {
      // Validate file
      this.validateFile(file)

      // Store the file
      const storedFile = await this.storageService.storeFile(file, "originals")

      // Get image metadata
      const metadata = await this.processorService.getImageMetadata(storedFile.path)

      // Determine image format
      const format = this.getImageFormat(file.mimetype)

      // Create image record
      const createImageDto: CreateImageDto = {
        filename: storedFile.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        format,
        size: storedFile.size,
        width: metadata.width,
        height: metadata.height,
        path: storedFile.path,
        publicUrl: storedFile.publicUrl,
        status: ProcessingStatus.COMPLETED,
        metadata: {
          ...metadata,
        },
      }

      // Save to database
      const image = await this.imageRepository.create(createImageDto)

      // Generate thumbnails asynchronously
      this.generateThumbnails(image.id, storedFile.path).catch((error) => {
        this.logger.error(`Error generating thumbnails: ${error.message}`, error.stack)
      })

      return image
    } catch (error) {
      this.logger.error(`Error uploading image: ${error.message}`, error.stack)
      throw new BadRequestException(`Failed to upload image: ${error.message}`)
    }
  }

  async findAll(query: ImageQueryDto): Promise<{ items: Image[]; total: number; page: number; limit: number }> {
    const [items, total] = await this.imageRepository.findAll(query)
    return {
      items,
      total,
      page: query.page || 1,
      limit: query.limit || 10,
    }
  }

  async findOne(id: string): Promise<Image> {
    const image = await this.imageRepository.findOne(id)
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`)
    }
    return image
  }

  async update(id: string, updateImageDto: UpdateImageDto): Promise<Image> {
    const image = await this.findOne(id)
    return this.imageRepository.update(id, updateImageDto)
  }

  async remove(id: string): Promise<void> {
    const image = await this.findOne(id)

    // Delete file from storage
    if (image.path) {
      await this.storageService.deleteFile(image.path)
    }

    // Delete variants if they exist
    if (image.variants && image.variants.length > 0) {
      for (const variant of image.variants) {
        if (variant.path) {
          await this.storageService.deleteFile(variant.path)
        }
      }
    }

    // Delete from database
    await this.imageRepository.remove(id)
  }

  async processImage(processImageDto: ProcessImageDto): Promise<Image> {
    const { imageId, outputFormat, resize, crop, optimize, variantName, replaceOriginal } = processImageDto

    // Find the image
    const image = await this.findOne(imageId)

    // Update status to processing
    await this.imageRepository.updateStatus(imageId, ProcessingStatus.PROCESSING)

    try {
      // Determine output path and filename
      const originalExt = path.extname(image.filename)
      const baseName = path.basename(image.filename, originalExt)
      const outputExt = outputFormat ? `.${outputFormat}` : originalExt
      const outputFilename = variantName
        ? `${baseName}_${variantName}${outputExt}`
        : `${baseName}_processed${outputExt}`

      // Determine output directory
      const outputDir = replaceOriginal ? path.dirname(image.path) : path.join(path.dirname(image.path), "../variants")

      // Ensure output directory exists
      await fs.mkdir(outputDir, { recursive: true })

      // Full output path
      const outputPath = path.join(outputDir, outputFilename)

      // Process the image
      const result = await this.processorService.processImage(image.path, outputPath, {
        resize,
        crop,
        optimize,
        outputFormat,
      })

      // Create variant record
      const variant = {
        name: variantName || "processed",
        path: outputPath,
        publicUrl:
          this.config.storage.driver === "s3"
            ? this.storageService.getSignedUrl(outputPath)
            : outputPath.replace(this.config.storage.local.storagePath, `/${this.config.storage.local.servePath}`),
        width: result.width,
        height: result.height,
        size: result.size,
        format: result.format,
        processingOptions: {
          resize,
          crop,
          optimize,
          outputFormat,
        },
      }

      // If replacing original, update the image record
      if (replaceOriginal) {
        // Delete the original file if it's different from the output
        if (image.path !== outputPath) {
          await this.storageService.deleteFile(image.path)
        }

        // Update image record
        const updateData: UpdateImageDto = {
          path: outputPath,
          publicUrl: variant.publicUrl,
          width: result.width,
          height: result.height,
          size: result.size,
          format: result.format as ImageFormat,
          isOptimized: !!optimize,
          processingOptions: {
            resize,
            crop,
            optimize,
            outputFormat,
          },
        }

        await this.imageRepository.update(imageId, updateData)
      } else {
        // Add as a variant
        await this.imageRepository.addVariant(imageId, variant)
      }

      // Update status to completed
      await this.imageRepository.updateStatus(imageId, ProcessingStatus.COMPLETED)

      // Return updated image
      return this.findOne(imageId)
    } catch (error) {
      // Update status to failed
      await this.imageRepository.updateStatus(imageId, ProcessingStatus.FAILED)

      this.logger.error(`Error processing image: ${error.message}`, error.stack)
      throw new BadRequestException(`Failed to process image: ${error.message}`)
    }
  }

  async batchProcessImages(batchProcessDto: BatchProcessImageDto): Promise<Image[]> {
    const results = []

    for (const operation of batchProcessDto.operations) {
      try {
        const result = await this.processImage(operation)
        results.push(result)
      } catch (error) {
        this.logger.error(`Error in batch processing for image ${operation.imageId}: ${error.message}`)
        // Continue with next operation even if one fails
      }
    }

    return results
  }

  async optimizeImage(imageId: string, quality?: number): Promise<Image> {
    return this.processImage({
      imageId,
      optimize: {
        quality: quality || this.config.processing.defaultQuality,
        progressive: true,
      },
      variantName: "optimized",
      replaceOriginal: false,
    })
  }

  private async generateThumbnails(imageId: string, imagePath: string): Promise<void> {
    try {
      const image = await this.findOne(imageId)

      // Determine output directory
      const outputDir = path.join(path.dirname(imagePath), "../thumbnails")

      // Generate thumbnails
      const thumbnails = await this.processorService.generateThumbnails(
        imagePath,
        outputDir,
        path.basename(imagePath, path.extname(imagePath)),
      )

      // Add thumbnails as variants
      for (const thumbnail of thumbnails) {
        await this.imageRepository.addVariant(imageId, {
          name: `thumbnail_${thumbnail.size}`,
          ...thumbnail,
          publicUrl:
            this.config.storage.driver === "s3"
              ? this.storageService.getSignedUrl(thumbnail.path)
              : thumbnail.path.replace(
                  this.config.storage.local.storagePath,
                  `/${this.config.storage.local.servePath}`,
                ),
        })
      }
    } catch (error) {
      this.logger.error(`Error generating thumbnails: ${error.message}`, error.stack)
    }
  }

  private validateFile(file: Express.Multer.File): void {
    // Check file size
    if (file.size > this.config.limits.fileSize) {
      throw new BadRequestException(`File size exceeds the limit of ${this.config.limits.fileSize / 1024 / 1024}MB`)
    }

    // Check mime type
    if (!this.config.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Unsupported file type. Allowed types: ${this.config.allowedMimeTypes.join(", ")}`)
    }
  }

  private getImageFormat(mimeType: string): ImageFormat {
    switch (mimeType) {
      case "image/jpeg":
        return ImageFormat.JPEG
      case "image/png":
        return ImageFormat.PNG
      case "image/webp":
        return ImageFormat.WEBP
      case "image/gif":
        return ImageFormat.GIF
      default:
        throw new BadRequestException(`Unsupported image format: ${mimeType}`)
    }
  }
}

