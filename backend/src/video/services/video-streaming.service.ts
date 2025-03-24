import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { VideoService } from "./video.service"
import type { Response } from "express"
import * as fs from "fs"
import * as path from "path"
import type { ConfigService } from "@nestjs/config"
import { VideoStatus, VideoVisibility } from "../entities/video.entity"
import type { StorageFactoryService } from "../storage/storage-factory.service"
import * as http from "http"
import * as https from "https"

@Injectable()
export class VideoStreamingService {
  private readonly uploadDir: string

  constructor(
    private videoService: VideoService,
    private configService: ConfigService,
    private storageFactoryService: StorageFactoryService,
  ) {
    this.uploadDir = this.configService.get<string>("UPLOAD_DIR", "uploads")
  }

  async streamVideo(id: string, range: string, res: Response, userId?: string): Promise<void> {
    const video = await this.videoService.findOne(id)

    // Check if video is ready
    if (video.status !== VideoStatus.READY) {
      throw new BadRequestException("Video is not ready for streaming")
    }

    // Check access permissions
    if (video.visibility === VideoVisibility.PRIVATE && video.userId !== userId) {
      throw new NotFoundException("Video not found")
    }

    // Increment view count (only if range starts from beginning)
    if (!range || range.startsWith("bytes=0-")) {
      await this.videoService.incrementViews(id)
    }

    // Check if CDN is enabled and use CDN URL if available
    const storageConfig = this.storageFactoryService.getStorageConfig()
    if (storageConfig.cdnEnabled && video.cdnUrl) {
      // Redirect to CDN
      return this.streamFromCdn(video.cdnUrl, range, res)
    }

    // Stream based on storage type
    if (storageConfig.type === "local") {
      await this.streamFromLocalStorage(video.fileUrl, range, res)
    } else {
      // For cloud storage, we'll proxy the request
      await this.streamFromCloudStorage(video.fileUrl, range, res)
    }
  }

  private async streamFromLocalStorage(fileUrl: string, range: string, res: Response): Promise<void> {
    // Extract file path from URL
    const urlObj = new URL(fileUrl)
    const filePath = path.join(process.cwd(), urlObj.pathname)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException("Video file not found")
    }

    const stat = fs.statSync(filePath)
    const fileSize = stat.size

    if (range) {
      // Parse range
      const parts = range.replace(/bytes=/, "").split("-")
      const start = Number.parseInt(parts[0], 10)
      const end = parts[1] ? Number.parseInt(parts[1], 10) : fileSize - 1
      const chunkSize = end - start + 1

      // Create read stream
      const file = fs.createReadStream(filePath, { start, end })

      // Set headers
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      })

      // Stream the file
      file.pipe(res)
    } else {
      // No range requested, send entire file
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      })

      fs.createReadStream(filePath).pipe(res)
    }
  }

  private async streamFromCloudStorage(fileUrl: string, range: string, res: Response): Promise<void> {
    // Get a signed URL for the video
    const storageProvider = this.storageFactoryService.getStorageProvider()

    // Extract the key from the URL
    const urlParts = fileUrl.split("/")
    const key = urlParts[urlParts.length - 1]

    const signedUrl = await storageProvider.getSignedUrl(key)

    // Create a request to the signed URL
    const urlObj = new URL(signedUrl)
    const client = urlObj.protocol === "https:" ? https : http

    const options: http.RequestOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: "GET",
      headers: {},
    }

    // Add range header if provided
    if (range) {
      options.headers["Range"] = range
    }

    // Make request to cloud storage
    const request = client.request(options, (response) => {
      // Forward status code and headers
      res.writeHead(response.statusCode, response.headers)

      // Pipe the response
      response.pipe(res)
    })

    request.on("error", (err) => {
      console.error("Error streaming from cloud storage:", err)
      res.status(500).send("Error streaming video")
    })

    request.end()
  }

  private async streamFromCdn(cdnUrl: string, range: string, res: Response): Promise<void> {
    // For CDN, we'll redirect the client
    res.redirect(cdnUrl)
  }
}

