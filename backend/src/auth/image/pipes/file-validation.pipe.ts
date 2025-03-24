import { type PipeTransform, Injectable, type ArgumentMetadata, BadRequestException } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import type { ImageConfig } from "../config/image.config"
import type { Express } from "express"

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly config: ImageConfig

  constructor(private readonly configService: ConfigService) {
    this.config = this.configService.get<ImageConfig>("image")
  }

  transform(value: Express.Multer.File | Express.Multer.File[], metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException("No file provided")
    }

    if (Array.isArray(value)) {
      // Validate multiple files
      if (value.length > this.config.limits.files) {
        throw new BadRequestException(`Too many files. Maximum allowed: ${this.config.limits.files}`)
      }

      for (const file of value) {
        this.validateFile(file)
      }
    } else {
      // Validate single file
      this.validateFile(value)
    }

    return value
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
}

