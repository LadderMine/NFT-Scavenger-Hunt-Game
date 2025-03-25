import { Injectable } from "@nestjs/common"
import type { StorageProvider, UploadedFileInfo } from "../interfaces/storage-provider.interface"
import * as fs from "fs"
import * as path from "path"
import type { ConfigService } from "@nestjs/config"
import { promisify } from "util"
import * as crypto from "crypto"
import type { Express } from "express"

const writeFileAsync = promisify(fs.writeFile)
const unlinkAsync = promisify(fs.unlink)
const mkdirAsync = promisify(fs.mkdir)

@Injectable()
export class LocalStorageProvider implements StorageProvider {
  private readonly uploadDir: string
  private readonly baseUrl: string

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get<string>("UPLOAD_DIR", "uploads")
    this.baseUrl = this.configService.get<string>("BASE_URL", "http://localhost:3000")

    // Ensure upload directory exists
    this.ensureUploadDirExists()
  }

  private async ensureUploadDirExists(): Promise<void> {
    try {
      await mkdirAsync(this.uploadDir, { recursive: true })
    } catch (error) {
      if (error.code !== "EEXIST") {
        throw error
      }
    }
  }

  async uploadFile(file: Express.Multer.File, filePath: string): Promise<UploadedFileInfo> {
    const fullPath = path.join(this.uploadDir, filePath)
    const dirName = path.dirname(fullPath)

    // Ensure directory exists
    await mkdirAsync(dirName, { recursive: true })

    // Write file
    await writeFileAsync(fullPath, file.buffer)

    return {
      url: `${this.baseUrl}/${this.uploadDir}/${filePath}`,
      size: file.size,
      mimetype: file.mimetype,
    }
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    // For local storage, we'll create a simple signed URL with a token
    const token = crypto
      .createHmac("sha256", this.configService.get<string>("APP_SECRET", "secret"))
      .update(key)
      .update(Date.now().toString())
      .update((Date.now() + expiresIn * 1000).toString())
      .digest("hex")

    return `${this.baseUrl}/${this.uploadDir}/${key}?token=${token}&expires=${Date.now() + expiresIn * 1000}`
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      await unlinkAsync(path.join(this.uploadDir, key))
      return true
    } catch (error) {
      return false
    }
  }
}

