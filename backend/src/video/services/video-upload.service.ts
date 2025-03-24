import { Injectable, BadRequestException } from "@nestjs/common"
import type { VideoService } from "./video.service"
import type { StorageFactoryService } from "../storage/storage-factory.service"
import type { CreateVideoDto } from "../dto/create-video.dto"
import { type Video, VideoStatus } from "../entities/video.entity"
import * as path from "path"
import * as crypto from "crypto"
import * as ffmpeg from "fluent-ffmpeg"
import { promisify } from "util"
import * as fs from "fs"
import type { Express } from "express"

const mkdirAsync = promisify(fs.mkdir)
const unlinkAsync = promisify(fs.unlink)

@Injectable()
export class VideoUploadService {
  constructor(
    private videoService: VideoService,
    private storageFactoryService: StorageFactoryService,
  ) {}

  async uploadVideo(file: Express.Multer.File, createVideoDto: CreateVideoDto): Promise<Video> {
    if (!file) {
      throw new BadRequestException("Video file is required")
    }

    // Validate file type
    const allowedMimeTypes = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska"]
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Invalid file type. Allowed types: ${allowedMimeTypes.join(", ")}`)
    }

    // Create video record in database
    const video = await this.videoService.create({
      ...createVideoDto,
      // Set initial status to processing
      // The file URL will be updated after upload
    })

    try {
      // Generate unique filename
      const fileExt = path.extname(file.originalname)
      const fileName = `${crypto.randomUUID()}${fileExt}`
      const filePath = `videos/${video.id}/${fileName}`

      // Upload to storage
      const storageProvider = this.storageFactoryService.getStorageProvider()
      const uploadResult = await storageProvider.uploadFile(file, filePath)

      // Extract video metadata (duration, etc.)
      const metadata = await this.extractVideoMetadata(file)

      // Update video record with file URL and metadata
      await this.videoService.update(video.id, {
        fileUrl: uploadResult.url,
        cdnUrl: uploadResult.cdnUrl,
        duration: metadata.duration,
        status: VideoStatus.READY,
      })

      // Generate thumbnail (in background)
      this.generateThumbnail(file, video.id).catch((error) => {
        console.error("Error generating thumbnail:", error)
      })

      return this.videoService.findOne(video.id)
    } catch (error) {
      // If upload fails, update video status and rethrow
      await this.videoService.updateVideoStatus(video.id, VideoStatus.FAILED)
      throw error
    }
  }

  private async extractVideoMetadata(file: Express.Multer.File): Promise<{ duration: number }> {
    return new Promise((resolve, reject) => {
      // Create a temporary file to analyze
      const tempDir = "temp"
      const tempFilePath = path.join(tempDir, `${crypto.randomUUID()}.mp4`)

      // Ensure temp directory exists
      mkdirAsync(tempDir, { recursive: true })
        .then(() => {
          // Write the file
          fs.writeFile(tempFilePath, file.buffer, async (err) => {
            if (err) return reject(err)

            // Use ffmpeg to get metadata
            ffmpeg.ffprobe(tempFilePath, (err, metadata) => {
              // Clean up temp file
              unlinkAsync(tempFilePath).catch(console.error)

              if (err) return reject(err)

              const duration = Math.floor(metadata.format.duration || 0)
              resolve({ duration })
            })
          })
        })
        .catch(reject)
    })
  }

  private async generateThumbnail(file: Express.Multer.File, videoId: string): Promise<void> {
    const tempDir = "temp"
    const tempFilePath = path.join(tempDir, `${crypto.randomUUID()}.mp4`)
    const thumbnailPath = path.join(tempDir, `${crypto.randomUUID()}.jpg`)

    // Ensure temp directory exists
    await mkdirAsync(tempDir, { recursive: true })

    // Write the file
    await promisify(fs.writeFile)(tempFilePath, file.buffer)

    return new Promise((resolve, reject) => {
      ffmpeg(tempFilePath)
        .screenshots({
          timestamps: ["10%"], // Take screenshot at 10% of the video
          filename: path.basename(thumbnailPath),
          folder: path.dirname(thumbnailPath),
          size: "640x360",
        })
        .on("end", async () => {
          try {
            // Read the thumbnail file
            const thumbnailBuffer = await promisify(fs.readFile)(thumbnailPath)

            // Upload thumbnail to storage
            const storageProvider = this.storageFactoryService.getStorageProvider()
            const thumbnailFileName = `thumbnails/${videoId}/${path.basename(thumbnailPath)}`

            const uploadResult = await storageProvider.uploadFile(
              {
                buffer: thumbnailBuffer,
                originalname: path.basename(thumbnailPath),
                mimetype: "image/jpeg",
                size: thumbnailBuffer.length,
              } as Express.Multer.File,
              thumbnailFileName,
            )

            // Update video with thumbnail URL
            await this.videoService.update(videoId, {
              thumbnailUrl: uploadResult.url,
            })

            // Clean up temp files
            await Promise.all([unlinkAsync(tempFilePath), unlinkAsync(thumbnailPath)])

            resolve()
          } catch (error) {
            reject(error)
          }
        })
        .on("error", (err) => {
          // Clean up temp files
          Promise.all([
            unlinkAsync(tempFilePath),
            unlinkAsync(thumbnailPath).catch(() => {}), // Thumbnail might not exist
          ]).catch(console.error)

          reject(err)
        })
    })
  }
}

