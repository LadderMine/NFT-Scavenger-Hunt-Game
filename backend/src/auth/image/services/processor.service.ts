import { Injectable, Logger, BadRequestException } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import * as sharp from "sharp"
import * as path from "path"
import * as fs from "fs/promises"
import type { ImageConfig } from "../config/image.config"
import type { ResizeOptionsDto, CropOptionsDto, OptimizeOptionsDto } from "../dto/process-image.dto"
import { ImageFormat } from "../entities/image.entity"

@Injectable()
export class ProcessorService {
  private readonly logger = new Logger(ProcessorService.name)
  private readonly config: ImageConfig

  constructor(private readonly configService: ConfigService) {
    this.config = this.configService.get<ImageConfig>("image")
  }

  async processImage(
    inputPath: string,
    outputPath: string,
    options: {
      resize?: ResizeOptionsDto
      crop?: CropOptionsDto
      optimize?: OptimizeOptionsDto
      outputFormat?: ImageFormat
    },
  ): Promise<{
    width: number
    height: number
    size: number
    format: string
  }> {
    try {
      // Initialize Sharp with the input file
      let image = sharp(inputPath)

      // Get original metadata
      const metadata = await image.metadata()

      // Apply crop if specified
      if (options.crop) {
        const { left, top, width, height } = options.crop
        image = image.extract({ left, top, width, height })
      }

      // Apply resize if specified
      if (options.resize) {
        const { width, height, fit, withoutEnlargement } = options.resize
        image = image.resize({
          width,
          height,
          fit: fit ? sharp.fit.cover : sharp.fit.inside,
          withoutEnlargement: withoutEnlargement ?? true,
        })
      }

      // Apply format conversion if specified
      if (options.outputFormat) {
        switch (options.outputFormat) {
          case ImageFormat.JPEG:
            image = image.jpeg(options.optimize)
            break
          case ImageFormat.PNG:
            image = image.png(options.optimize)
            break
          case ImageFormat.WEBP:
            image = image.webp(options.optimize)
            break
          case ImageFormat.GIF:
            image = image.gif()
            break
          default:
            throw new BadRequestException(`Unsupported output format: ${options.outputFormat}`)
        }
      } else if (options.optimize) {
        // Apply optimization based on original format
        const format = metadata.format as ImageFormat
        switch (format) {
          case ImageFormat.JPEG:
            image = image.jpeg(options.optimize)
            break
          case ImageFormat.PNG:
            image = image.png(options.optimize)
            break
          case ImageFormat.WEBP:
            image = image.webp(options.optimize)
            break
          case ImageFormat.GIF:
            image = image.gif()
            break
        }
      }

      // Ensure the output directory exists
      await fs.mkdir(path.dirname(outputPath), { recursive: true })

      // Save the processed image
      await image.toFile(outputPath)

      // Get the new metadata
      const outputMetadata = await sharp(outputPath).metadata()
      const { size } = await fs.stat(outputPath)

      return {
        width: outputMetadata.width,
        height: outputMetadata.height,
        size,
        format: outputMetadata.format,
      }
    } catch (error) {
      this.logger.error(`Error processing image: ${error.message}`, error.stack)
      throw new BadRequestException(`Failed to process image: ${error.message}`)
    }
  }

  async generateThumbnails(inputPath: string, outputDir: string, baseName: string): Promise<Record<string, any>[]> {
    const thumbnails = []
    const thumbnailSizes = this.config.processing.thumbnails

    try {
      await fs.mkdir(outputDir, { recursive: true })

      for (const [size, dimensions] of Object.entries(thumbnailSizes)) {
        const outputPath = path.join(outputDir, `${baseName}_${size}.${this.config.processing.defaultFormat}`)

        const result = await this.processImage(inputPath, outputPath, {
          resize: {
            width: dimensions.width,
            height: dimensions.height,
            fit: true,
            withoutEnlargement: true,
          },
          optimize: {
            quality: this.config.processing.defaultQuality,
            progressive: true,
          },
          outputFormat: this.config.processing.defaultFormat as ImageFormat,
        })

        thumbnails.push({
          size,
          path: outputPath,
          width: result.width,
          height: result.height,
          fileSize: result.size,
          format: result.format,
        })
      }

      return thumbnails
    } catch (error) {
      this.logger.error(`Error generating thumbnails: ${error.message}`, error.stack)
      throw new BadRequestException(`Failed to generate thumbnails: ${error.message}`)
    }
  }

  async optimizeImage(
    inputPath: string,
    outputPath: string,
    options?: OptimizeOptionsDto,
  ): Promise<{
    width: number
    height: number
    size: number
    format: string
    originalSize: number
    compressionRatio: number
  }> {
    try {
      const originalStats = await fs.stat(inputPath)
      const originalSize = originalStats.size

      const metadata = await sharp(inputPath).metadata()
      const format = metadata.format as ImageFormat

      const optimizeOptions: OptimizeOptionsDto = {
        quality: options?.quality || this.config.processing.defaultQuality,
        progressive: options?.progressive !== undefined ? options.progressive : true,
        withMetadata: options?.withMetadata !== undefined ? options.withMetadata : false,
      }

      const result = await this.processImage(inputPath, outputPath, {
        optimize: optimizeOptions,
        outputFormat: format as ImageFormat,
      })

      const compressionRatio = originalSize / result.size

      return {
        ...result,
        originalSize,
        compressionRatio,
      }
    } catch (error) {
      this.logger.error(`Error optimizing image: ${error.message}`, error.stack)
      throw new BadRequestException(`Failed to optimize image: ${error.message}`)
    }
  }

  async getImageMetadata(filePath: string): Promise<{
    width: number
    height: number
    format: string
    channels: number
    hasAlpha: boolean
    orientation?: number
    exif?: any
  }> {
    try {
      const metadata = await sharp(filePath).metadata()

      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        channels: metadata.channels,
        hasAlpha: metadata.hasAlpha,
        orientation: metadata.orientation,
        exif: metadata.exif
          ? await sharp(filePath)
              .metadata()
              .then((m) => m.exif)
          : undefined,
      }
    } catch (error) {
      this.logger.error(`Error getting image metadata: ${error.message}`, error.stack)
      throw new BadRequestException(`Failed to get image metadata: ${error.message}`)
    }
  }
}

