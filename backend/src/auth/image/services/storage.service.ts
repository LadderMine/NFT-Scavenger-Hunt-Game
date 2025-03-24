import { Injectable, Logger, BadRequestException } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import * as path from "path"
import * as fs from "fs/promises"
import * as crypto from "crypto"
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import type { ImageConfig } from "../config/image.config"
import type { Express } from "express"

export interface StoredFile {
  filename: string
  path: string
  publicUrl: string
  size: number
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name)
  private readonly config: ImageConfig
  private s3Client: S3Client

  constructor(private readonly configService: ConfigService) {
    this.config = this.configService.get<ImageConfig>("image")

    if (this.config.storage.driver === "s3") {
      this.s3Client = new S3Client({
        region: this.config.storage.s3.region,
        credentials: {
          accessKeyId: this.config.storage.s3.accessKeyId,
          secretAccessKey: this.config.storage.s3.secretAccessKey,
        },
      })
    }
  }

  async storeFile(file: Express.Multer.File, subDirectory?: string): Promise<StoredFile> {
    try {
      const filename = this.generateUniqueFilename(file.originalname)

      if (this.config.storage.driver === "s3") {
        return this.storeFileS3(file, filename, subDirectory)
      } else {
        return this.storeFileLocal(file, filename, subDirectory)
      }
    } catch (error) {
      this.logger.error(`Error storing file: ${error.message}`, error.stack)
      throw new BadRequestException(`Failed to store file: ${error.message}`)
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      if (this.config.storage.driver === "s3") {
        // Extract key from S3 URL or path
        const key = this.getS3KeyFromPath(filePath)
        await this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.config.storage.s3.bucket,
            Key: key,
          }),
        )
      } else {
        // For local storage, check if file exists before deleting
        const exists = await this.fileExists(filePath)
        if (exists) {
          await fs.unlink(filePath)
        }
      }
    } catch (error) {
      this.logger.error(`Error deleting file: ${error.message}`, error.stack)
      throw new BadRequestException(`Failed to delete file: ${error.message}`)
    }
  }

  async moveFile(sourcePath: string, destinationPath: string): Promise<string> {
    try {
      if (this.config.storage.driver === "s3") {
        // For S3, we need to copy and then delete
        const sourceKey = this.getS3KeyFromPath(sourcePath)
        const destinationKey = this.getS3KeyFromPath(destinationPath)

        // Copy the object to the new location
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: this.config.storage.s3.bucket,
            Key: destinationKey,
            CopySource: `${this.config.storage.s3.bucket}/${sourceKey}`,
          }),
        )

        // Delete the original object
        await this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.config.storage.s3.bucket,
            Key: sourceKey,
          }),
        )

        return this.getS3PublicUrl(destinationKey)
      } else {
        // For local storage, ensure destination directory exists
        await fs.mkdir(path.dirname(destinationPath), { recursive: true })

        // Move the file
        await fs.rename(sourcePath, destinationPath)

        return destinationPath
      }
    } catch (error) {
      this.logger.error(`Error moving file: ${error.message}`, error.stack)
      throw new BadRequestException(`Failed to move file: ${error.message}`)
    }
  }

  async getSignedUrl(filePath: string, expiresIn = 3600): Promise<string> {
    if (this.config.storage.driver !== "s3") {
      throw new BadRequestException("Signed URLs are only available for S3 storage")
    }

    try {
      const key = this.getS3KeyFromPath(filePath)
      const command = new GetObjectCommand({
        Bucket: this.config.storage.s3.bucket,
        Key: key,
      })

      return getSignedUrl(this.s3Client, command, { expiresIn })
    } catch (error) {
      this.logger.error(`Error generating signed URL: ${error.message}`, error.stack)
      throw new BadRequestException(`Failed to generate signed URL: ${error.message}`)
    }
  }

  private async storeFileLocal(
    file: Express.Multer.File,
    filename: string,
    subDirectory?: string,
  ): Promise<StoredFile> {
    const storagePath = this.config.storage.local.storagePath
    const targetDir = subDirectory ? path.join(storagePath, subDirectory) : storagePath

    // Ensure the directory exists
    await fs.mkdir(targetDir, { recursive: true })

    const filePath = path.join(targetDir, filename)

    // Write the file
    await fs.writeFile(filePath, file.buffer)

    // Get file size
    const stats = await fs.stat(filePath)

    // Generate public URL
    const servePath = this.config.storage.local.servePath
    const publicPath = subDirectory ? `/${servePath}/${subDirectory}/${filename}` : `/${servePath}/${filename}`

    return {
      filename,
      path: filePath,
      publicUrl: publicPath,
      size: stats.size,
    }
  }

  private async storeFileS3(file: Express.Multer.File, filename: string, subDirectory?: string): Promise<StoredFile> {
    const key = subDirectory ? `${subDirectory}/${filename}` : filename

    // Upload to S3
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.config.storage.s3.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    )

    // Generate public URL
    const publicUrl = this.getS3PublicUrl(key)

    return {
      filename,
      path: key, // Store the S3 key as the path
      publicUrl,
      size: file.size,
    }
  }

  private getS3PublicUrl(key: string): string {
    if (this.config.storage.s3.baseUrl) {
      return `${this.config.storage.s3.baseUrl}/${key}`
    }
    return `https://${this.config.storage.s3.bucket}.s3.${this.config.storage.s3.region}.amazonaws.com/${key}`
  }

  private getS3KeyFromPath(filePath: string): string {
    // If it's a full URL, extract the key
    if (filePath.startsWith("http")) {
      const baseUrl =
        this.config.storage.s3.baseUrl ||
        `https://${this.config.storage.s3.bucket}.s3.${this.config.storage.s3.region}.amazonaws.com`
      return filePath.replace(`${baseUrl}/`, "")
    }

    // If it's already a key (no http/https prefix)
    return filePath
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath)
      return true
    } catch {
      return false
    }
  }

  private generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now()
    const randomString = crypto.randomBytes(8).toString("hex")
    const extension = path.extname(originalName)
    const sanitizedName = path
      .basename(originalName, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .substring(0, 20)

    return `${sanitizedName}-${timestamp}-${randomString}${extension}`
  }
}

